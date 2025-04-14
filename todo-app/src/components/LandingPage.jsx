import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
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
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 pl-8">
              Productive Mind
            </h2>
            <p className="text-gray-600 text-lg mb-8 pl-8 pr-8">
              With only the features you need, Organic Mind is customized for individuals seeking a stress-free way to stay focused on their goals, projects, and tasks.
            </p>
            <div className="space-y-4 px-8">
              <Link
                to="/signin"
                className="block w-full text-center px-8 py-4 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#FFC700] transition-colors"
              >
                Get Started
              </Link>
              <p className="text-gray-500 text-center">
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
  )
}

export default LandingPage 