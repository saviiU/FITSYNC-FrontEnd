import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import "../styles/Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    goal: "",
    healthIssues: "",
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agreed) {
      alert("Please accept the terms and conditions.");
      return;
    }

    // Backend registration connection will be added later
    console.log("Registration data:", formData);
    alert("Registration form submitted!");
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h1>FITSYNC</h1>
        <h2>Create Your Account</h2>
        <p>Start your fitness journey with us.</p>

        <form onSubmit={handleSubmit}>

          <label>
            <User size={16} /> Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>
            <Mail size={16} /> Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>
            <Lock size={16} /> Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <label>Fitness Goal</label>

          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            required
          >
            <option value="">Select your goal</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Fitness">General Fitness</option>
            <option value="Strength">Strength Training</option>
          </select>

          <label>Health Issues (Optional)</label>

          <textarea
            name="healthIssues"
            placeholder="Mention any relevant health issues"
            value={formData.healthIssues}
            onChange={handleChange}
            rows="3"
          />

          <div className="terms-row">
            <input
              type="checkbox"
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              required
            />

            <span>
              I agree to the Terms and Conditions.
            </span>
          </div>

          <button type="submit">Create Account</button>

        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;