import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Link } from "react-router-dom";
import "./BookDetailsPage.css";

function BookDetailsPage() {
  const { bookId } = useParams();
  const { user, setUser } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readingStatus, setReadingStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const storedToken = localStorage.getItem("authToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/books/${bookId}`)
      .then((response) => {
        setBook(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error al cargar el libro:", error);
        setIsLoading(false);
      });
  }, [bookId]);

  useEffect(() => {
    if (!user || !bookId) return;

    const isInWantToRead = user.wantToRead?.some((book) => book._id === bookId);
    const isInCurrentlyReading = user.currentlyReading?.some(
      (book) => book._id === bookId
    );
    const isInRead = user.read?.some((book) => book._id === bookId);

    if (isInWantToRead) {
      setReadingStatus("wantToRead");
    } else if (isInCurrentlyReading) {
      setReadingStatus("currentlyReading");
    } else if (isInRead) {
      setReadingStatus("read");
    } else {
      setReadingStatus("");
    }

    const savedProgress = user.readingProgress?.[bookId] || 0;
    setCurrentPage(savedProgress);
  }, [user, bookId]);

  const handleReadingStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}/reading-status`,
        {
          bookId,
          status: newStatus,
        },
        authConfig
      );

      setUser(response.data);
      setReadingStatus(newStatus);
    } catch (error) {
      console.log("Error actualizando estado de lectura:", error);
    }
  };

  const handleUpdateProgress = async () => {
    try {
      const safePage = Math.min(Number(currentPage), book.pages || 0);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}/progress/${bookId}`,
        {
          currentPage: safePage,
        },
        authConfig
      );

      setUser(response.data);
      setCurrentPage(safePage);
    } catch (error) {
      console.log("Error actualizando progreso:", error);
    }
  };

  if (isLoading) {
    return <p>Cargando libro...</p>;
  }

  if (!book) {
    return <p>No se pudo cargar el libro.</p>;
  }

  const progressPercent =
    book.pages && currentPage
      ? Math.round((Number(currentPage) / book.pages) * 100)
      : 0;

  const mainGenre = book.genre?.[0] || "Literatura";

  return (
    <div className="book-details-page">
      <div className="book-details-layout">
        <div className="book-details-left">
          <div className="book-cover-card">
            <img
              src={book.coverImage || "https://via.placeholder.com/300x450?text=No+Cover"}
              alt={book.title}
            />
          </div>

          {user && (
            <div className="book-action-buttons">
              <select
                className="book-status-select"
                value={readingStatus}
                onChange={handleReadingStatusChange}
              >
                <option value="" disabled>
                  + Añadir a
                </option>
                <option value="wantToRead">Pendiente</option>
                <option value="currentlyReading">Leyendo</option>
                <option value="read">Leído</option>
              </select>

              <div className="progress-update-box">
                <input
                  type="number"
                  min="0"
                  max={book.pages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                  className="progress-input"
                  placeholder="Páginas leídas"
                />
                <button
                  className="book-btn book-btn-secondary"
                  onClick={handleUpdateProgress}
                >
                  Actualizar progreso
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="book-details-right">
          <p className="book-meta-top">
            {mainGenre.toUpperCase()} • {book.pages} PÁGINAS
          </p>

          <h1 className="book-title">{book.title}</h1>

          <p className="book-author">
            Escrito por <span>{book.author}</span>
          </p>

          {user ? (
            <div className="book-progress-card">
              <div className="book-progress-header">
                <span>Progreso actual</span>
                <span>{progressPercent}%</span>
              </div>

              <div className="book-progress-bar">
                <div
                  className="book-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="book-progress-quote">
                Página {currentPage} de {book.pages}
              </p>
            </div>
          ) : (
            <p className="book-login-hint">
              <Link to="/login">Inicia sesión</Link> para guardar este libro y seguir tu progreso.
            </p>
          )}

          <div className="book-synopsis">
            <h2>Sinopsis</h2>
            <p>
              {book.description ||
                "Todavía no hay descripción disponible para este libro."}
            </p>
          </div>

          {book.genre?.length > 0 && (
            <div className="book-tags">
              {book.genre.map((genreItem, index) => (
                <span key={index} className="book-tag">
                  {genreItem}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPage;