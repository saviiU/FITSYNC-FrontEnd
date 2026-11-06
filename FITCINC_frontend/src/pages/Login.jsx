import { useState } from "react";
import {
  Dumbbell,
  ArrowLeft,
  UserCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  LogIn,
} from "lucide-react";

import "../styles/Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("member");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login Details:", formData);
  };

  return (
    <div className="login-page">

      <header className="auth-header">
        <button className="icon-btn" type="button">
          <ArrowLeft size={22} />
        </button>

        <h2>FITSYNC</h2>

        <button className="profile-btn" type="button">
          <UserCircle size={20} />
        </button>
      </header>

      <main className="auth-main">

        <section className="hero">
          <div className="hero-badge">
            <Dumbbell size={28} />
          </div>

          <h1>Welcome Back!</h1>

          <p className="hero-subtitle">
            Sign in to continue your fitness journey with FITSYNC.
          </p>
        </section>

        <div className="toggle">
          <button
            type="button"
            className={loginType === "member" ? "active" : ""}
            onClick={() => setLoginType("member")}
          >
            Member
          </button>

          <button
            type="button"
            className={loginType === "trainer" ? "active" : ""}
            onClick={() => setLoginType("trainer")}
          >
            Trainer
          </button>
        </div>

        <div className="card">

          <div className="info-chip">
            <ShieldCheck size={18} />
            Secure login to your {loginType} account
          </div>

          <form onSubmit={handleLogin}>

            <div className="field">
              <div className="field-row">
                <label>Email Address</label>
              </div>

              <div className="input-wrap">
                <Mail size={20} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <div className="field-row">
                <label>Password</label>

                <a href="#" className="link">
                  Forgot Password?
                </a>
              </div>

              <div className="input-wrap">
                <Lock size={20} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Sign In <LogIn size={18} />
            </button>

          </form>

          <div className="divider">
            OR CONTINUE WITH
          </div>

          <div className="social-grid">
            <button type="button" className="social-btn">
              Google
            </button>

            <button type="button" className="social-btn">
              Apple
            </button>
          </div>

          <p className="footer-text">
            Don't have an account?{" "}
            <a href="/register">Create Account</a>
          </p>

        </div>
      </main>
    </div>
  );
}

export default Login;