import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const handleLogin = () => {
    // This is the FIX:
    // Instead of a hardcoded localhost URL, we use the environment variable.
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="login-page-container">
      <motion.div 
        className="login-branding-panel"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <div className="logo-container">
          <h1>UniDash</h1>
          <p>Your Campus, Delivered.</p>
        </div>
      </motion.div>

      <div className="login-form-panel">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2>Welcome to UniDash</h2>
          <p className="login-subtext">The premium peer-to-peer delivery platform for VIT.</p>
          <button onClick={handleLogin} className="login-button">
            <img 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="Google logo" 
              className="google-icon"
            />
            Sign in with Google
          </button>
          <p className="domain-notice">
            Requires a @vitstudent.ac.in email address.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;