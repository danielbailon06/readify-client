import { useContext } from "react";
import { NavLink, Link } from "react-router-dom"; // 👈 ambos
import { AuthContext } from "../context/auth.context";
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo">
          Readify
        </NavLink>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link_logged active" : "nav-link_logged"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/library"
              className={({ isActive }) =>
                isActive ? "nav-link_logged active" : "nav-link_logged"
              }
            >
              Library
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link_logged active" : "nav-link_logged"
              }
            >
              Profile
            </NavLink>

            <button onClick={logOutUser} className="nav-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Iniciar sesión
            </Link>

            <Link to="/signup" className="nav-cta">
              Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;