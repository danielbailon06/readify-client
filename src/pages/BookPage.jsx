import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./BookPage.css";

function BookPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const search = queryParams.get("search") || "";
  const genre = queryParams.get("genre") || "";

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/books`)
      .then((response) => {
        setBooks(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error al obtener libros:", error);
        setIsLoading(false);
      });
  }, []);

  const filteredBooks = books.filter((book) => {
    const searchLower = search.toLowerCase();
    const genreLower = genre.toLowerCase();

    const matchesSearch =
      !search ||
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.genre.join(" ").toLowerCase().includes(searchLower);

    const matchesGenre =
      !genre ||
      book.genre.some((g) => g.toLowerCase() === genreLower);

    return matchesSearch && matchesGenre;
  });

  if (isLoading) {
    return <p>Cargando libros...</p>;
  }

  return (
    <div className="book-page">
      <h1>{genre || search || "Libros"}</h1>

      {search && (
        <p className="search-info">
          Resultados para: "{search}"
        </p>
      )}

      {genre && (
        <p className="search-info">
          Mood lector: "{genre}"
        </p>
      )}

      <div className="book-list">
        {filteredBooks.length === 0 ? (
          <p className="empty-state">
            Aún no hay libros por aquí… pero eso solo significa que hay espacio
            para nuevas historias ✨
            <br />
            Si echas alguno en falta, cuéntanoslo en readify@support.com 💌
          </p>
        ) : (
          filteredBooks.map((book) => (
            <Link
              to={`/books/${book._id}`}
              className="book-card"
              key={book._id}
            >
              <img
                src={
                  book.coverImage ||
                  "https://via.placeholder.com/120x170?text=Book"
                }
                alt={book.title}
                className="book-cover"
              />

              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>

                <p className="book-description">{book.description}</p>

                <div className="book-tags">
                  {book.genre.map((g, i) => (
                    <span key={i} className="book-tag">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default BookPage;