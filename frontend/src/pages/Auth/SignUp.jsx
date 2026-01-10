import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";


const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Validation functions
  const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (touched[name]) {
      const newFieldErrors = { ...fieldErrors };
      if (name === "name") {
        newFieldErrors.name = validateName(value);
      } else if (name === "email") {
        newFieldErrors.email = validateEmail(value);
      } else if (name === "password") {
        newFieldErrors.password = validatePassword(value);
        // Also revalidate confirm password if it's been touched
        if (touched.confirmPassword) {
          newFieldErrors.confirmPassword = validateConfirmPassword(
            formData.confirmPassword,
            value
          );
        }
      } else if (name === "confirmPassword") {
        newFieldErrors.confirmPassword = validateConfirmPassword(
          value,
          formData.password
        );
      }

      setFieldErrors(newFieldErrors);
    }

    if (error) setError("");
  };


  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    const newFieldErrors = { ...fieldErrors };
    if (name === "name") {
      newFieldErrors.name = validateName(formData.name);
    } else if (name === "email") {
      newFieldErrors.email = validateEmail(formData.email);
    } else if (name === "password") {
      newFieldErrors.password = validatePassword(formData.password);
    } else if (name === "confirmPassword") {
      newFieldErrors.confirmPassword = validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      );
    }
    setFieldErrors(newFieldErrors);
  };

  const isFormValid = () => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    return (
      !nameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
    );
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setFieldErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );
      const data = response.data;
      const { token } = data;

      if (response.status === 201) {
        setSuccess("Account Created Successfully");

        //Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTouched({
          name: false,
          email: false,
          password: false,
          confirmPassword: false,
        });

        //Login the user immediately after successfull registration
        login(data, token);
        navigate("/dashboard");
      };
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("API error:", err.response || err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm">
            Join Invoice Generator today
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter your full name"
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none ${fieldErrors.name && touched.name
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
                  }`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none ${fieldErrors.email && touched.email
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
                  }`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Create a password"
                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none ${fieldErrors.password && touched.password
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Confirm your password"
                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none ${fieldErrors.confirmPassword && touched.confirmPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
                  }`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Terms */}
          <div className="flex items-start">
            <input type="checkbox" required className="mt-1" />
            <p className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-black font-medium">Terms of Service</span> and{" "}
              <span className="text-black font-medium">Privacy Policy</span>
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
            className="w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white py-3 rounded-lg flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-black font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;