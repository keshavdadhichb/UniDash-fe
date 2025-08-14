import { Link } from "wouter";
import './LoginError.css';

const LoginError = () => {
  // THE FIX: We read the query string directly from the browser's window object.
  // We don't need the useLocation hook for this.
  const searchParams = new URLSearchParams(window.location.search);
  const reason = searchParams.get('reason');

  let errorMessage = "An unknown authentication error occurred. Please try again.";
  if (reason === 'domain_mismatch') {
    errorMessage = "Login Failed. Only accounts with a @vitstudent.ac.in email are permitted to use this service.";
  } else if (reason === 'auth_failed') {
    errorMessage = "The authentication with Google failed. This can sometimes be a temporary issue. Please try again.";
  }

  return (
    <div className="error-page-container">
      <div className="error-box">
        <h2>Access Denied</h2>
        <p className="error-message">{errorMessage}</p>
        <Link href="/">
          <a className="try-again-button">Return to Login Page</a>
        </Link>
      </div>
    </div>
  );
};

export default LoginError;