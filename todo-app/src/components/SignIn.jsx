import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    // Check user credentials
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    // Set current user and redirect
    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate('/todos');
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


        {/* Right side white container with content */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border flex flex-col justify-center">
          <div className="w-[659px] mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-black">
              Sign in
            </h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email.email@mail.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-20 outline-none transition-colors bg-white"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-20 outline-none transition-colors bg-white [&::placeholder]:text-gray-400 [-webkit-text-security:disc] [text-security:disc]"
                  style={{ WebkitTextSecurity: 'square', textSecurity: 'square' }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#FFC700] transition-colors"
              >
                Sign in
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
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#FFD700] hover:text-[#FFC700] font-medium">
                  Sign up
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

export default SignIn 