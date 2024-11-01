"use client";

import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/login", credentials);
      alert("Logged in successfully!");
    } catch (error) {
      console.error(error);
      alert("Login failed!");
    }
  };

  return (
    <section className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Username / Email"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <div className="flex relative items-center gap-2">
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send Login Link
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
              You will get a special link on email to login.
            </div>
          )}
        </div>
      </form>
    </section >
  );
};

export default Login;