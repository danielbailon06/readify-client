import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupPage.css";
import signupImg from "../assets/library-signup.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Ha ocurrido un error al crear la cuenta.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-shell">
        <div className="signup-left">
          <img src={signupImg} alt="Cozy reading corner" className="signup-image" />

          <div className="signup-image-overlay">
            <h2>Tu santuario digital te espera.</h2>
            <p>
              Reúne tus pensamientos, organiza tu biblioteca y encuentra un rincón
              acogedor en una comunidad llena de lectores.
            </p>
          </div>
        </div>

        <div className="signup-right">
          <div className="signup-card">
            <p className="signup-brand">Readify</p>
            <h1>Crear cuenta</h1>
            <p className="signup-subtitle">Comienza hoy mismo tu viaje a un nuevo universo de lectura</p>

            <form onSubmit={handleSignupSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="username">NOMBRE DE USUARIO</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Tu nombre"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">CORREO ELECTRÓNICO</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="hello@readify.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="password-row">
                <div className="form-group">
                  <label htmlFor="password">CONTRASEÑA</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">CONFIRMAR CONTRASEÑA</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <button type="submit" className="signup-submit-btn">
                Crear cuenta
              </button>
            </form>

            <p className="signup-login-text">
              Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;