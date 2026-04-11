import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function BookPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";

  useEffect(() => {
    axios
      .get("http://localhost:5005/api/books")
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

    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.genre.join(" ").toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return <p>Cargando libros...</p>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Libros</h1>

      {search && <p>Resultados para: "{search}"</p>}

      {filteredBooks.length === 0 ? (
        <p>No se encontraron libros.</p>
      ) : (
        filteredBooks.map((book) => (
          <div
            key={book._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <h3>{book.title}</h3>
            <p><strong>Autor:</strong> {book.author}</p>
            <p><strong>Géneros:</strong> {book.genre.join(", ")}</p>
            <p>{book.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default BookPage;