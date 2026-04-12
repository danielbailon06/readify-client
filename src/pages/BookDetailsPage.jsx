import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./BookDetailsPage.css";

function BookDetailsPage() {
  const { bookId } = useParams();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5005/api/books/${bookId}`)
      .then((response) => {
        setBook(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error al cargar el libro:", error);
        setIsLoading(false);
      });
  }, [bookId]);

  if (isLoading) {
    return <p>Cargando libro...</p>;
  }

  if (!book) {
    return <p>No se pudo cargar el libro.</p>;
  }

  const fakeProgress = 64;
  const fakePages = 342;
  const mainGenre = book.genre?.[0] || "Literatura";

  return (
    <div className="book-details-page">
      <div className="book-details-layout">
        <div className="book-details-left">
          <div className="book-cover-card">
            <img src={book.coverImage} alt={book.title} />
          </div>

          <div className="book-action-buttons">
            <button className="book-btn book-btn-primary">
              + Añadir a
            </button>

            <button className="book-btn book-btn-secondary">
              Actualizar progreso
            </button>
          </div>
        </div>

        <div className="book-details-right">
          <p className="book-meta-top">
            {mainGenre.toUpperCase()} • {fakePages} PÁGINAS
          </p>

          <h1 className="book-title">{book.title}</h1>

          <p className="book-author">
            Escrito por <span>{book.author}</span>
          </p>

          <div className="book-progress-card">
            <div className="book-progress-header">
              <span>Progreso actual</span>
              <span>{fakeProgress}%</span>
            </div>

            <div className="book-progress-bar">
              <div
                className="book-progress-fill"
                style={{ width: `${fakeProgress}%` }}
              />
            </div>

            <p className="book-progress-quote">
              “Between life and death there is a library...”
            </p>
          </div>

          <div className="book-synopsis">
            <h2>Sinopsis</h2>
            <p>
              {book.description || "Todavía no hay descripción disponible para este libro."}
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