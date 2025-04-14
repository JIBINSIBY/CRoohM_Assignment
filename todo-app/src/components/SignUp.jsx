import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate form
    if (!formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === formData.email)) {
      setError('Email already registered');
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      email: formData.email,
      phone: formData.phone,
      password: formData.password // In a real app, you should hash the password
    };

    // Add user to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Set current user
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Show success message
    setSuccessMessage('User registered successfully!');

    // Redirect to todos page after a short delay
    setTimeout(() => {
      navigate('/todos');
    }, 2000);
  };

  return (
    <div className="h-screen bg-white p-6">
      <div className="container mx-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Left side black container with logo and illustration */}
          <div className="bg-black rounded-3xl p-8 flex flex-col">
            {/* Logo */}
            <h1 className="text-4xl font-bold text-white mb-8">
              Organic
              <br />
              Mind
            </h1>

            {/* Illustration */}
            <div className="flex-1 relative flex items-center justify-center">
              <svg className="w-4/5 h-4/5" viewBox="0 0 400 400">
                {/* White curved line */}
                <path
                  d="M200,100 Q300,200 200,300"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Yellow circles */}
                <circle cx="150" cy="120" r="40" fill="#FFD700" />
                <circle cx="280" cy="280" r="45" fill="#FFD700" />

                {/* Orange/Coral circles */}
                <circle cx="300" cy="180" r="35" fill="#FF6B6B" />
                <circle cx="180" cy="280" r="35" fill="#FF6B6B" />

                {/* White circle outline */}
                <circle
                  cx="200"
                  cy="200"
                  r="25"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Small white dots */}
                <circle cx="180" cy="150" r="3" fill="white" />
                <circle cx="220" cy="180" r="2" fill="white" />
                <circle cx="240" cy="220" r="2" fill="white" />
              </svg>
            </div>
          </div>

          {/* Right side white container with sign up form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border flex flex-col justify-center">
            <div className="w-[659px] mx-auto space-y-8">
              <h2 className="text-4xl font-bold text-black">
                Sign up
              </h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-20 outline-none transition-colors bg-white"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-20 outline-none transition-colors bg-white"
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-20 outline-none transition-colors bg-white"
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-20 outline-none transition-colors bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#FFC700] transition-colors"
                >
                  Create account
                </button>
              </form>

              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-gray-50">
                    <span className="text-gray-700 font-medium">Google</span>
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-gray-50">
                    <span className="text-gray-700 font-medium">Facebook</span>
                  </button>
                </div>

                <p className="text-center text-gray-600">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-[#FFD700] hover:text-[#FFC700] font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp