import { Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const handleLogin = (e) => {
    e.preventDefault();

    // Backend login connection will be added later
    console.log("Login submitted");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>FITSYNC</h1>
        <h2>Welcome Back!</h2>
        <p>Login to continue your fitness journey.</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="switch-text">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;