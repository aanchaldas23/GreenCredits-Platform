import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function LoginRegisterPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [role, setRole] = useState('individual');
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    if (error) setError("");
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      setError("Email and password are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!isSignIn && !role) {
      setError("Please select whether you are an Individual or Organization.");
      return false;
    }
    return true;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Sign in successful! Redirecting...");
        console.log("Sign In Success:", data);
        // In a real app, you'd store a token (e.g., localStorage.setItem('token', data.token);)
        navigate("/dashboard"); // Redirect to the dashboard page
      } else {
        setError(data.message || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Sign In Error:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful! You can now sign in.");
        setFormData({ email: "", password: "" });
        setRole('individual');
        setIsSignIn(true);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Sign Up Error:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
      <div
        className="w-full max-w-4xl flex rounded-lg shadow-2xl overflow-hidden"
        style={{ height: "520px" }}
      >
        {/* Sign In/Up Panel (Left side, dynamic content based on isSignIn state) */}
        <div className="w-1/2 bg-[#212121] text-white p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-4xl font-bold text-lime-500">
              {isSignIn ? "Sign in" : "Create Account"}
            </h1>
            <p className="text-gray-400 mt-2 mb-8">
              {isSignIn ? "Use your account" : "Enter your details to register"}
            </p>

            <form className="space-y-6" onSubmit={isSignIn ? handleSignIn : handleSignUp}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition"
                required
              />

              {!isSignIn && (
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Join as:</p>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="individual"
                        checked={role === 'individual'}
                        onChange={handleRoleChange}
                        className="form-radio h-4 w-4 text-lime-500 bg-gray-700 border-gray-600 focus:ring-lime-500"
                      />
                      <span className="ml-2 text-gray-300">Individual</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="organization"
                        checked={role === 'organization'}
                        onChange={handleRoleChange}
                        className="form-radio h-4 w-4 text-lime-500 bg-gray-700 border-gray-600 focus:ring-lime-500"
                      />
                      <span className="ml-2 text-gray-300">Organization</span>
                    </label>
                  </div>
                </div>
              )}

              {isSignIn && (
                <div className="text-left">
                  <a href="#" className="text-sm text-gray-400 hover:text-lime-400 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              )}

              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              {successMessage && <p className="text-green-400 text-sm mt-2">{successMessage}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-lime-500 text-white font-bold py-3 rounded-md hover:bg-lime-600 disabled:bg-gray-600 transition-colors uppercase tracking-wider mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : isSignIn ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="w-1/2 bg-lime-600 text-white p-12 flex flex-col justify-center items-center text-center">
          <div className="max-w-xs">
            <h1 className="text-4xl font-bold">
              {isSignIn ? "Hello, Friend!" : "Welcome Back!"}
            </h1>
            <p className="mt-4 mb-8 opacity-90 leading-relaxed">
              {isSignIn
                ? "Enter your details and start your journey with us"
                : "To keep connected with us please login with your personal info"}
            </p>
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError("");
                setSuccessMessage("");
                setFormData({ email: "", password: "" });
                setRole('individual');
              }}
              className="bg-transparent border-2 border-white font-bold py-2.5 px-10 rounded-lg hover:bg-white hover:text-lime-600 transition-all duration-300 uppercase tracking-wider"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
