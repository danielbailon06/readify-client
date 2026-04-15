import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import loginImg from "../assets/library-login.png";
import { AuthContext } from "../context/auth.context";

const API_URL = `${import.meta.env.VITE_API_URL}`;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();
  const { authenticateUser } = useContext(AuthContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const requestBody = { email, password };

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        requestBody
      );

      const token = response.data.authToken;

      localStorage.setItem("authToken", token);

      await authenticateUser();

      navigate("/");
    } catch (error) {
      const errorDescription = error.response?.data?.message || "Error al iniciar sesión";
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-left">
          <img
            src={loginImg}
            alt="Cozy reading corner"
            className="signup-image"
          />

          <div className="login-image-overlay">
            <h2>Bienvenido de nuevo a tu santuario.</h2>
            <p>
              Cada libro es una experiencia que aún no has visitado. Abre la
              puerta a tu librería digital.
            </p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-brand">Readify</div>
            <h1>Iniciar sesión</h1>
            <p className="login-subtitle">
              Vuelve a tu espacio de lectura y sigue donde lo dejaste.
            </p>

            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>CORREO ELECTRÓNICO</label>
                <input
                  type="email"
                  placeholder="hello@readify.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>CONTRASEÑA</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="login-submit-btn">
                Iniciar sesión
              </button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <p className="login-signup-text">
              ¿No tienes una cuenta? <Link to="/signup">Crear cuenta</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;