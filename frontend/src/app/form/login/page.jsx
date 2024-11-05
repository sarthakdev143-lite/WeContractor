"use client";

import { useState } from "react";
import { MYAXIOS } from "../../../components/Helper";
import { AuthUtils } from "../../../components/utils/auth";
import FormInput from "../../../components/auth/FormInput";
import { validators } from "../../../components/sell/utils";
import { ToastContainer } from 'react-toastify';
import { notify } from '../../../components/notifications';
import 'react-toastify/dist/ReactToastify.css';

// Error handling utility functions
const handleValidationErrors = (errorData, setErrors) => {
  const newErrors = {};

  if (Array.isArray(errorData.errors)) {
    errorData.errors.forEach(error => {
      if (error.field) {
        newErrors[error.field] = error.message;
        notify.error(`${error.field}: ${error.message}`);
      }
    });
  }
  else if (errorData.errors && typeof errorData.errors === 'object') {
    Object.entries(errorData.errors).forEach(([field, message]) => {
      newErrors[field] = message;
      notify.error(`${field}: ${message}`);
    });
  }
  else if (errorData.message) {
    const field = determineErrorField(errorData.message);
    if (field) {
      newErrors[field] = errorData.message;
    }
    notify.error(errorData.message);
  }

  setErrors(prev => ({
    ...prev,
    ...newErrors
  }));
};

const determineErrorField = (errorMessage) => {
  const errorMessage_lower = errorMessage.toLowerCase();
  if (errorMessage_lower.includes('username') || errorMessage_lower.includes('email')) return 'identifier';
  if (errorMessage_lower.includes('password')) return 'password';
  return null;
};

const Login = () => {
  // State management
  const [credentials, setCredentials] = useState({
    identifier: "", // Can be username or email
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Form validation helper
  const validateField = (name, value) => {
    if (name === 'identifier') {
      // Check if input is email or username
      const isEmail = value.includes('@');
      return isEmail ? validators.email(value) : validators.username(value);
    }
    if (validators[name]) {
      return validators[name](value);
    }
    return "";
  };

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Form validation
  const isFormValid = () => {
    const newErrors = {
      identifier: validateField("identifier", credentials.identifier),
      password: validateField("password", credentials.password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      notify.error("Please fix all validation errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Trying to Login with credentials :-\n" + JSON.stringify(credentials, null, 2));

      const response = await MYAXIOS.post("/api/auth/initiate-login", {
        identifier: credentials.identifier,
        password: credentials.password
      });

      if (response.data.success) {
        setEmailSent(true);
        notify.success("Login verification link has been sent to your email!");

        // Clear password but keep identifier for reference
        setCredentials(prev => ({ ...prev, password: "" }));
      } else {
        handleValidationErrors(response.data, setErrors);
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        switch (status) {
          case 400:
            handleValidationErrors(errorData, setErrors);
            break;
          case 401:
            notify.error("Invalid credentials. Please try again.");
            break;
          case 403:
            notify.error("Account is locked. Please contact support.");
            break;
          case 429:
            notify.error("Too many attempts. Please try again later.");
            break;
          case 500:
            notify.error("Server error. Please try again later.");
            break;
          default:
            notify.error(errorData.message || "An unexpected error occurred.");
        }
      } else if (error.request) {
        console.log("Error Request : " + error.request);
        notify.error("Network error. Please check your connection.");
      } else {
        notify.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          type="text"
          name="identifier"
          value={credentials.identifier}
          onChange={handleChange}
          placeholder="Username / Email"
          error={errors.identifier}
          isLoading={isLoading}
          disabled={emailSent}
        />

        {!emailSent && (
          <FormInput
            type={showPassword ? "text" : "password"}
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            error={errors.password}
            isLoading={isLoading}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
        )}

        {emailSent ? (
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600 mb-2">Check your email!</p>
            <p className="text-sm text-gray-600">
              We've sent a verification link to {credentials.identifier}
            </p>
          </div>
        ) : (
          <div className="flex relative items-center gap-2">
            <button
              type="submit"
              disabled={isLoading || Object.values(errors).some(error => error !== "")}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2" />
                  Sending Login Link...
                </>
              ) : (
                'Send Login Link'
              )}
            </button>
            <button
              type="button"
              className="text-white hover:text-gray-200 focus:outline-none"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              aria-label="Login information"
            >
              <i className="ri-information-2-line text-black text-xl cursor-pointer"></i>
            </button>
            {showTooltip && (
              <div className="absolute max-w-48 text-center top-2/3 -right-1/2 -translate-x-1/2 w-64 p-2 mt-2 md:text-sm text-base text-gray-600 bg-white border rounded-lg shadow-2xl">
                A secure login link will be sent to your email address.
              </div>
            )}
          </div>
        )}
      </form>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        limit={3}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
};

export default Login;