import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import "./LibraryPage.css";
import { Link } from "react-router-dom";

function LibraryPage() {
  const { user } = useContext(AuthContext);

  const [libraryUser, setLibraryUser] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("currentlyReading");
  const [isLoading, setIsLoading] = useState(true);

  const yearlyGoal = 50;

  useEffect(() => {
    if (!user?._id) return;

    Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/books`),
    ])
      .then(([userResponse, booksResponse]) => {
        setLibraryUser(userResponse.data);
        setAllBooks(booksResponse.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error al cargar la biblioteca:", error);
        setIsLoading(false);
      });
  }, [user]);

  if (isLoading) {
    return <p>Cargando biblioteca...</p>;
  }

  if (!libraryUser) {
    return <p>No se pudo cargar la biblioteca.</p>;
  }

  const booksToShow = libraryUser[activeTab] || [];
  const randomBooks = [...allBooks].sort(() => Math.random() - 0.5).slice(0, 12);

  const completedBooks = libraryUser.read || [];
  const completedCount = completedBooks.length;

  const yearlyProgressPercent = Math.min(
    Math.round((completedCount / yearlyGoal) * 100),
    100
  );

  const progressCircleStyle = {
    background: `conic-gradient(#5f775d ${yearlyProgressPercent}%, #cfe2c8 ${yearlyProgressPercent}% 100%)`,
  };

  const quotes = [
    "Un ratito de lectura, un refugio para el alma...",
    "Perderse en un libro también es encontrarse 📖",
    "Hoy es un buen día para empezar una historia nueva...",
    "Entre páginas todo encaja un poquito más 🤍",
    "Un capítulo más… y ya (mentira) 😏📖",
    "Leer también es una forma de descansar",
    "Cada libro es un pequeño viaje ✨",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="library-page">
      <div className="library-top">
        <div className="library-hero">
          <div className="library-hero-text">
            <h1>Tu pequeño refugio</h1>
            <p>
              Un rincón de calma, lleno de historias que abrazan como un hogar.
            </p>

            <div className="library-mini-stats">
              <div className="library-mini-stat">
                <span className="library-mini-number">
                  {libraryUser.currentlyReading?.length || 0}
                </span>
                <span className="library-mini-label">leyendo</span>
              </div>

              <div className="library-mini-stat">
                <span className="library-mini-number">
                  {libraryUser.wantToRead?.length || 0}
                </span>
                <span className="library-mini-label">pendientes</span>
              </div>

              <div className="library-mini-stat">
                <span className="library-mini-number">
                  {libraryUser.read?.length || 0}
                </span>
                <span className="library-mini-label">leídos</span>
              </div>
            </div>
          </div>



          <div className="year-goal-card">
            <div className="year-goal-circle" style={progressCircleStyle}>
              <div className="year-goal-circle-inner">
                <span className="year-goal-number">
                  {completedCount}/{yearlyGoal}
                </span>
                <span className="year-goal-books">LIBROS</span>
              </div>
            </div>

            <h3>Meta anual</h3>
            <p>{randomQuote}</p>
          </div>
        </div>
      </div>

      <div className="library-tabs-row">
        <div className="library-tabs">
          <button
            className={
              activeTab === "currentlyReading" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("currentlyReading")}
          >
            Leyendo
          </button>

          <button
            className={
              activeTab === "wantToRead" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("wantToRead")}
          >
            Pendiente
          </button>

          <button
            className={activeTab === "read" ? "tab-button active" : "tab-button"}
            onClick={() => setActiveTab("read")}
          >
            Leído
          </button>
        </div>
      </div>

      <div className="library-section-header">
        <h2>
          {activeTab === "currentlyReading" && "Acompañándote ahora…"}
          {activeTab === "wantToRead" && "A la espera de ser descubiertas."}
          {activeTab === "read" && "Historias que ya forman parte de ti."}
        </h2>

      </div>

      {booksToShow.length === 0 ? (
        <p className="library-empty">
          Este espacio espera su primera historia contigo.
        </p>
      ) : (
        <div className="library-grid">
          {booksToShow.map((book) => {
            const currentPage = libraryUser.readingProgress?.[book._id] || 0;

            const progress =
              activeTab === "wantToRead"
                ? 0
                : activeTab === "read"
                  ? 100
                  : book.pages
                    ? Math.min(Math.round((currentPage / book.pages) * 100), 100)
                    : 0;

            return (
              <Link
                to={`/books/${book._id}`}
                key={book._id}
                className="library-card-link"
              >
                <div className="library-card">
                  <div className="library-card-image">
                    <img
                      src={
                        book.coverImage ||
                        "https://via.placeholder.com/260x360?text=No+Cover"
                      }
                      alt={book.title}
                    />
                  </div>

                  <div className="library-card-body">
                    <div className="library-card-title-row">
                      <h3>{book.title}</h3>
                    </div>

                    <p>{book.author}</p>

                    {activeTab === "currentlyReading" && (
                      <p className="library-pages-text">
                        Página {currentPage} de {book.pages}
                      </p>
                    )}

                    <div className="library-progress">
                      <div className="library-progress-label-row">
                        <span className="library-progress-label">PROGRESO</span>
                        <span className="library-progress-value">{progress}%</span>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {randomBooks.length > 0 && (
        <div className="horizon-section">
          <h2>En el horizonte</h2>

          <div className="horizon-wrapper">
            <div className="horizon-row">
              {randomBooks.map((book) => (
                <Link
                  to={`/books/${book._id}`}
                  key={book._id}
                  className="horizon-book-link"
                >
                  <div className="horizon-book">
                    <img
                      src={
                        book.coverImage ||
                        "https://via.placeholder.com/120x180?text=No+Cover"
                      }
                      alt={book.title}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LibraryPage;