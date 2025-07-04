// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
let db;
MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db('greencredits'); // Connect to the 'greencredits' database
    console.log('✅ MongoDB connected');
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors()); // Enable CORS for all routes (crucial for frontend communication)
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded requests

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir)); // Serve static files from 'uploads' directory

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/', // Files will be stored in the 'uploads' directory
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${randomString}${ext}`);
  }
});

// Init upload: Add file type and size validation here
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        // Check file type to ensure it's PDF
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
}).single('certificate'); // 'certificate' must match the formData.append('certificate', file) in frontend


// ROUTES

// Basic route to check if the backend is running
app.get('/', (req, res) => {
  res.send('🌿 GreenCredits backend is running');
});

// Upload Certificate Route
app.post('/api/upload-certificate', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer upload error:', err.message);
      if (err.message === 'Only PDF files are allowed!') {
        return res.status(400).json({ message: 'Invalid file type. Only PDF files are allowed.' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Max 5MB allowed.' });
      }
      return res.status(500).json({ message: 'An unexpected error occurred during upload.' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file selected for upload.' });
    }

    try {
      const buffer = fs.readFileSync(file.path);
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');

      const existing = await db.collection('certificates').findOne({ hash });
      if (existing) {
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting duplicate file:', unlinkErr);
        });
        return res.status(409).json({ message: 'Duplicate certificate. This certificate has already been uploaded.', creditId: existing.creditId, hash });
      }

      const creditId = 'CREDIT-' + Date.now();
      const doc = {
        creditId,
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileMimeType: file.mimetype,
        fileSize: file.size,
        uploadDate: new Date(),
        hash,
        status: 'pending', // Initial status (e.g., 'pending', 'uploaded', 'unauthenticated')
      };

      await db.collection('certificates').insertOne(doc);
      res.status(201).json({ message: 'Certificate uploaded and details saved for authentication!', creditId, hash });
    } catch (err) {
      console.error('Database save or hash error:', err);
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file after DB error:', unlinkErr);
      });
      res.status(500).json({ message: 'Failed to process certificate. Please try again.' });
    }
  });
});


// Authenticate Certificate Route
app.post('/authenticate', async (req, res) => {
  try {
    const { creditId } = req.body;
    const cert = await db.collection('certificates').findOne({ creditId });
    if (!cert) {
      return res.status(404).json({ error: 'Credit ID not found' });
    }

    const filePath = cert.filePath;
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Certificate file not found on server.' });
    }

    const form = new FormData();
    form.append('certificate', fs.createReadStream(filePath));

    const flaskRes = await axios.post('http://localhost:5001/authenticate', form, {
      headers: form.getHeaders()
    });

    const authData = flaskRes.data;

    // Prepare the update document fields based on Flask response
    let updateFields = {
        status: authData.authenticated ? 'authenticated' : (authData.status || 'unauthenticated'), // Use authenticated flag first, then Flask status, default unauthenticated
        authenticatedAt: new Date(),
        flaskResponse: authData // Store the full Flask response for audit/debugging
    };

    if (authData.extracted_data) {
        updateFields.extractedData = authData.extracted_data; // Store the entire extracted_data object
    }
    if (authData.carbonmark_details) {
        updateFields.carbonmarkDetails = authData.carbonmark_details; // Store the entire carbonmark_details object
    }
    if (authData.blockchain_status) {
        updateFields.blockchainStatus = authData.blockchain_status; // Store blockchain status
    }
    if (authData.fabric_tx_id) {
        updateFields.fabricTxId = authData.fabric_tx_id; // Store Fabric Tx ID
    }

    // Perform the update
    const updated = await db.collection('certificates').findOneAndUpdate(
      { creditId },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!updated.value) {
        console.error(`Failed to find and update certificate with creditId: ${creditId}`);
        return res.status(500).json({ message: 'Failed to update certificate details after authentication.' });
    }

    res.json({
      message: 'Certificate authentication process completed!',
      creditId: updated.value.creditId,
      authResult: authData // Send the entire Flask response object back to frontend
    });
  } catch (err) {
    console.error('Auth error:', err.message);
    let errorMessage = 'Authentication request failed.';
    let statusCode = 500;
    if (err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage;
        statusCode = err.response.status;
    }

    if (req.body.creditId) {
        await db.collection('certificates').findOneAndUpdate(
            { creditId: req.body.creditId },
            { $set: { status: 'authentication_failed', authenticatedAt: new Date(), authenticationError: errorMessage } }
        );
    }
    res.status(statusCode).json({ error: errorMessage, details: err.message });
  }
});

// --- NEW: List on Marketplace Route ---
app.post('/api/list-on-marketplace', async (req, res) => {
    try {
        const { serial_number, price, priceType, extractedData, carbonmarkDetails } = req.body;

        if (!serial_number) {
            return res.status(400).json({ message: 'Serial number is required to list a credit.' });
        }

        // Find the certificate by serial_number (nested in extractedData)
        let certificate = await db.collection('certificates').findOne({ 'extractedData.serial_number': serial_number });

        let updateDoc = {
            isListed: true,
            priceType: priceType,
            status: 'listed', // Update overall status to 'listed'
            listedAt: new Date(),
        };

        if (priceType === 'fixed' && typeof price === 'number') {
            updateDoc.marketplacePrice = price;
        } else if (priceType === 'negotiation') {
            updateDoc.marketplacePrice = null; // Ensure price is null for negotiation
        }

        if (certificate) {
            // Update existing certificate
            await db.collection('certificates').updateOne(
                { 'extractedData.serial_number': serial_number },
                { $set: updateDoc }
            );
            res.status(200).json({ message: 'Credit successfully listed on marketplace!' });
        } else {
            // Fallback: If for some reason the cert isn't found by serial number,
            // create a new entry with the provided data.
            const newCreditId = 'CREDIT-' + Date.now();
            const newDoc = {
                creditId: newCreditId,
                extractedData: extractedData,
                carbonmarkDetails: carbonmarkDetails,
                uploadDate: new Date(),
                status: 'listed',
                isListed: true,
                priceType: priceType,
                marketplacePrice: updateDoc.marketplacePrice,
                listedAt: new Date(),
            };
            await db.collection('certificates').insertOne(newDoc);
            res.status(201).json({ message: 'Credit created and listed on marketplace!', creditId: newCreditId });
        }

    } catch (error) {
        console.error('Error listing credit on marketplace:', error);
        res.status(500).json({ message: 'Failed to list credit on marketplace.', error: error.message });
    }
});

// --- NEW: Get all credits for Dashboard ---
app.get('/api/credits', async (req, res) => {
    try {
        const credits = await db.collection('certificates').find({}).toArray();
        res.status(200).json(credits);
    } catch (error) {
        console.error('Error fetching credits:', error);
        res.status(500).json({ message: 'Failed to fetch credits.', error: error.message });
    }
});


// Helper: Generate userId
const generateUserId = () => 'USER-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8);

// User Registration (now /api/auth/signup)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    // IMPORTANT: Passwords are NOT hashed in this version. For secure applications, you MUST hash passwords.
    const userId = generateUserId();

    await db.collection('users').insertOne({
      userId,
      email,
      password: password,
      role: role,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Sign Up error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// User Login (now /api/auth/signin)
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // IMPORTANT: Passwords are NOT hashed in this version.
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Sign in successful!', userId: user.userId });
  } catch (err) {
    console.error('Sign In error:', err);
    res.status(500).json({ message: 'Server error during sign in.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});