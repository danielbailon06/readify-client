import { useContext, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmedSearch = search.trim();
    if (!trimmedSearch) return;

    navigate(`/books?search=${encodeURIComponent(trimmedSearch)}`);
    setSearch("");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo">
          Readify
        </NavLink>
      </div>

      {isLoggedIn && (
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <span className="navbar-search-icon">⌕</span>
          <input
            type="text"
            placeholder="Busca un libro, autor o género..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      )}

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
              Inicio
            </NavLink>

            <NavLink
              to="/library"
              className={({ isActive }) =>
                isActive ? "nav-link_logged active" : "nav-link_logged"
              }
            >
              Libreria
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link_logged active" : "nav-link_logged"
              }
            >
              Perfil
            </NavLink>

            <button onClick={logOutUser} className="nav-button">
              Cerrar sesión
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