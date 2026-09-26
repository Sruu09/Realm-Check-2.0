import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      navigate('/onboarding');
    } else {
      navigate('/realm');
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{
        backgroundColor: '#71a361',
        backgroundImage: 'radial-gradient(#5d8a4d 15%, transparent 15%), radial-gradient(#5d8a4d 15%, transparent 15%)',
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px'
      }}
    >
      <div className="absolute inset-0 pointer-events-none" />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Parchment Container */}
        <div className="bg-[#fcf5e3] rounded-2xl border-4 border-[#b58c5a] shadow-2xl p-8 relative">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#4a3b2c] mb-2">
              {isRegistering ? 'Create Your Account' : 'Welcome Back, Explorer!'}
            </h1>
            <p className="text-[#8c7457] text-sm">
              {isRegistering ? 'Every great journey begins with a single step.' : 'Great journeys continue here.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {isRegistering && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  className="w-full bg-[#fdfaf0] border border-[#d4c3a3] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#483c6c]"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                className="w-full bg-[#fdfaf0] border border-[#d4c3a3] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#483c6c]"
                placeholder="Email or Username"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                className="w-full bg-[#fdfaf0] border border-[#d4c3a3] rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-[#483c6c]"
                placeholder="Password"
                required
              />
              <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" size={18} />
            </div>

            {!isRegistering && (
              <div className="flex items-center justify-between text-xs font-bold text-[#6d5945]">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded text-[#483c6c] focus:ring-[#483c6c]" />
                  Remember me
                </label>
                <a href="#" className="hover:text-[#483c6c]">Forgot Password?</a>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#483c6c] hover:bg-[#382d56] text-white font-bold text-sm py-3 rounded-lg shadow-md transition-colors"
            >
              {isRegistering ? 'Join the Realm' : 'Enter the Realm'}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#d4c3a3]"></div>
              <span className="flex-shrink-0 mx-4 text-[#a69477] text-xs">or</span>
              <div className="flex-grow border-t border-[#d4c3a3]"></div>
            </div>

            <button 
              type="button"
              className="w-full bg-white hover:bg-gray-50 text-[#4a3b2c] font-bold text-sm py-3 border border-[#d4c3a3] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-bold text-[#6d5945]">
            {isRegistering ? (
              <p>Already have an account? <button onClick={() => setIsRegistering(false)} className="text-[#483c6c] underline">Login</button></p>
            ) : (
              <p>New to Realm Check? <button onClick={() => setIsRegistering(true)} className="text-[#483c6c] underline">Create an Account</button></p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
