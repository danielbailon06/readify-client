import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import './WelcomePage.css';
import libraryImg from '../assets/library-welcome.png';
import bookCover from "../assets/book-cover.png";

import { LuPencilLine } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuPalette } from "react-icons/lu";
import { HiOutlineBookOpen } from "react-icons/hi";

function WelcomePage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmedSearch = search.trim();
    if (!trimmedSearch) return;

    navigate(`/books?search=${encodeURIComponent(trimmedSearch)}`);
  };

  return (
    <>
      <div className="welcome-container">

        <div className="welcome-div">
          <p className="welcome-readify">Bienvenido a Readify</p>
          <h1 className="welcome-title">Tu pequeño <span>rincón</span> para perderte entre libros</h1>
          <p className="welcome-text">Un espacio acogedor para amantes de los libros, donde tus lecturas cobran vida. Organiza, descubre y comparte historias en un rincón pensado para ti.</p>

          <form className="welcome-search" onSubmit={handleSearchSubmit}>
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Busca un libro, autor o género..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="signup-login">
            <Link to="/signup">
              <button>Crear cuenta</button>
            </Link>

            <Link to="/login">
              <button>Iniciar sesión</button>
            </Link>
          </div>
        </div>

        <div className="welcome-image">
          <img src={libraryImg} alt="library" />
        </div>

      </div>

      <section className="community-section">
        <div className="community-header">
          <h2>Favoritos de la Comunidad</h2>
          <p>Lo que se está leyendo en Readify esta semana.</p>
        </div>

        <div className="community-content">
          <div className="favorite-book-card">
            <div className="favorite-book-image">
              <img src={bookCover} alt="Libro destacado" />
            </div>

            <div className="favorite-book-info">
              <div className="book-tags">
                <span className="tag-green">Tendencia</span>
                <span className="tag-gray">Fantasia</span>
              </div>

              <h3>Quicksilver</h3>

              <p className="book-description">
                Quicksilver mezcla ciencia, política y aventura en la Europa del siglo XVII. La historia sigue a varios personajes —entre ellos científicos,
                alquimistas y nobles— en una época de grandes descubrimientos,
                donde nacen ideas que cambiarán el mundo, como la física moderna o la economía financiera.
              </p>

              <div className="book-recommendation">
                <div className="avatars">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>+ de 300 personas lo recomiendan</p>
              </div>
            </div>
          </div>

          <div className="challenge-card">
            <div className="challenge-icon"><HiOutlineBookOpen /></div>
            <h3>Reto de Lectura</h3>
            <p>
              Únete a miles de lectores y alcanza tu meta de libros este año.
            </p>
            <Link to="/signup" className="challenge-card-button">
              Unirme ahora
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">

          <div className="feature-item">
            <div className="feature-icon"><LuPencilLine /></div>
            <h3>Diarios Personales</h3>
            <p>
              Registra tus lecturas mientras lees en una interfaz diseñada para la
              reflexión sin distracciones.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-icon"><LuUsers /></div>
            <h3>Siéntete agusto</h3>
            <p>
              Encuentra tu nicho. Desde clásicos rusos hasta fantasía épica, hay un
              rincón para cada gusto.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-icon"><LuPalette /></div>
            <h3>Sé tu mismo</h3>
            <p>
              Personaliza tu perfil con estanterías virtuales que reflejan tu
              personalidad literaria única.
            </p>
          </div>

        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <h2>¿Listo para empezar tu viaje?</h2>
          <p>
            Únete hoy y transforma tu hábito de lectura en una experiencia cálida e intensa.
          </p>

          <div className="cta-buttons">
            <Link to="/signup">
              <button className="cta-primary">Crear Cuenta</button>
            </Link>

            <Link to="/login">
              <button className="cta-secondary">Iniciar sesión</button>
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}

export default WelcomePage;