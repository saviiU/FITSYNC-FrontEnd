import { useState } from "react";
import {
  Dumbbell,
  ArrowLeft,
  UserCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  Info,
  ArrowRight,
} from "lucide-react";

import "../styles/Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("Weight Loss");
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    healthIssues: "",
  });

  const goals = [
    "Weight Loss",
    "Muscle Gain",
    "Stay Fit",
    "Improve Strength",
    "Build Endurance",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please accept the Terms and Conditions.");
      return;
    }

    console.log({
      ...formData,
      goal: selectedGoal,
      agreed,
    });
  };

  return (
    <div className="register-page">

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

          <p className="hero-eyebrow">
            START YOUR FITNESS JOURNEY
          </p>

          <h1>Create Account</h1>

          <p className="hero-subtitle">
            Join FITSYNC and take the first step towards a healthier you.
          </p>
        </section>

        <div className="goal-header">
          <span className="goal-title">
            What's your fitness goal?
          </span>

          <span className="goal-hint">
            Choose one
          </span>
        </div>

        <div className="chips">
          {goals.map((goal) => (
            <button
              key={goal}
              type="button"
              className={`chip ${
                selectedGoal === goal ? "active" : ""
              }`}
              onClick={() => setSelectedGoal(goal)}
            >
              {goal}
            </button>
          ))}
        </div>

        <div className="card">

          <div className="info-box">
            <div className="info-icon">
              <Info size={16} />
            </div>

            <div>
              <h3>Your Fitness Profile</h3>
              <p>
                Add your details to help us personalize your fitness experience.
              </p>
            </div>
          </div>

          <form onSubmit={handleRegister}>

            <div className="field">
              <div className="field-row">
                <label>Full Name</label>
              </div>

              <div className="input-wrap">
                <User size={20} />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
              </div>

              <div className="input-wrap">
                <Lock size={20} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
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

              <div className="helper">
                <span>Use at least 8 characters</span>
              </div>
            </div>

            <div className="field">
              <div className="field-row">
                <label>Health Issues</label>

                <span className="field-optional">
                  Optional
                </span>
              </div>

              <div className="input-wrap top">
                <Info size={20} />

                <textarea
                  name="healthIssues"
                  rows="3"
                  placeholder="Mention any health concerns (optional)"
                  value={formData.healthIssues}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label className="terms">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />

              <span className={`checkbox-box ${agreed ? "checked" : ""}`}>
                {agreed && <Check size={16} />}
              </span>

              <span>
                I agree to the <a href="#">Terms & Conditions</a>
                {" "}and <a href="#">Privacy Policy</a>.
              </span>
            </label>

            <div className="trial-badge">
              <div className="info-chip">
                <ShieldCheck size={18} />
                Your information is kept secure.
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={!agreed}
            >
              Create Account <ArrowRight size={18} />
            </button>

          </form>

          <div className="divider">
            OR SIGN UP WITH
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
            Already have an account?{" "}
            <a href="/login">Sign In</a>
          </p>

        </div>
      </main>
    </div>
  );
}

export default Register;