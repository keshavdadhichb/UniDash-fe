"use client"

import { useState } from "react"
import "./Login.css"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    // Simulate loading for demo
    setTimeout(() => {
      window.location.href = "http://localhost:8080/auth/google"
    }, 1000)
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">U</div>
            <span className="logo-text">UniDash</span>
          </div>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <div className="login-card">
          <div className="login-card-content">
            <button onClick={handleLogin} disabled={isLoading} className="login-button">
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="google-icon"
                />
              )}
              <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
            </button>

            <div className="login-footer">
              <p className="email-requirement">Requires @vitstudent.ac.in email</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
