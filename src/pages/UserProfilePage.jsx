import "./UserProfilePage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiMapPin } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

function UserProfilePage() {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);

  const loadUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5005/api/users/${userId}`
      );
      setProfileUser(response.data);
    } catch (error) {
      console.log("Error loading user:", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, [userId]);

  if (!profileUser) {
    return <p className="user-profile-loading">Cargando perfil...</p>;
  }

  const currentlyReading = profileUser.currentlyReading || [];
  const readBooks = profileUser.read || [];
  const wantToRead = profileUser.wantToRead || [];

  return (
    <div className="user-profile-page">
      <div className="user-profile-container">
        <Link to="/profile" className="user-profile-back-link">
          ← Volver
        </Link>

        <div className="user-profile-top-card">
          <div className="user-profile-avatar-wrapper">
            <img
              src={profileUser.profileImage || "/avatars/avatar1.png"}
              alt={profileUser.username}
              className="user-profile-avatar"
              onError={(e) => {
                e.target.src = "/avatars/avatar1.png";
              }}
            />
          </div>

          <div className="user-profile-top-info">
            <div className="user-profile-info-header">
              <div className="user-profile-info-text">
                <h1 className="user-profile-name">{profileUser.username}</h1>

                <div className="user-profile-location">
                  <FiMapPin />
                  <span>{profileUser.location || "Añade tu ubicación"}</span>
                </div>

                <p className="user-profile-bio">
                  {profileUser.bio ||
                    "Esta alma lectora aún no ha escrito su historia ✨"}
                </p>
              </div>
            </div>

            <div className="user-profile-badges">
              <span className="user-profile-badge user-badge-green">
                Lector destacado
              </span>
              <span className="user-profile-badge user-badge-peach">
                Coleccionista de historias
              </span>
            </div>
          </div>
        </div>

        <div className="user-profile-content-grid">
          <div className="user-profile-left-column">
            <div>
              <div className="user-section-title-row">
                <h2>Resumen lector</h2>
              </div>

              <div className="user-reading-journey-card">
                <div className="user-journey-stats">
                  <div className="user-journey-stat">
                    <span className="user-journey-stat-label">En proceso</span>
                    <span className="user-journey-stat-value">
                      {currentlyReading.length}
                    </span>
                  </div>

                  <div className="user-journey-stat">
                    <span className="user-journey-stat-label">Leídos</span>
                    <span className="user-journey-stat-value">
                      {readBooks.length}
                    </span>
                  </div>

                  <div className="user-journey-stat">
                    <span className="user-journey-stat-label">Pendientes</span>
                    <span className="user-journey-stat-value">
                      {wantToRead.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="user-books-card">
              <div className="user-books-header">
                <h3>Actualmente leyendo</h3>
                <span className="user-books-count">
                  {currentlyReading.length} libros
                </span>
              </div>

              {currentlyReading.length > 0 ? (
                <div className="user-books-grid">
                  {currentlyReading.map((book) => (
                    <div key={book._id} className="user-book-card">
                      <Link
                        to={`/books/${book._id}`}
                        className="user-book-link"
                      >
                        <img
                          src={
                            book.coverImage ||
                            "https://via.placeholder.com/120x180?text=Book"
                          }
                          alt={book.title}
                          className="user-book-cover"
                        />
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="user-empty-text">
                  Ahora mismo no tiene ninguna lectura en curso.
                </p>
              )}
            </div>

            <div className="user-books-card">
              <div className="user-books-header">
                <h3>Libros leídos</h3>
                <span className="user-books-count">
                  {readBooks.length} libros
                </span>
              </div>

              {readBooks.length > 0 ? (
                <div className="user-books-grid">
                  {readBooks.map((book) => (
                    <div key={book._id} className="user-book-card">
                      <Link
                        to={`/books/${book._id}`}
                        className="user-book-link"
                      >
                        <img
                          src={
                            book.coverImage ||
                            "https://via.placeholder.com/120x180?text=Book"
                          }
                          alt={book.title}
                          className="user-book-cover"
                        />
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="user-empty-text">
                  Todavía no ha marcado libros como leídos.
                </p>
              )}
            </div>

            <div className="user-books-card">
              <div className="user-books-header">
                <h3>Quiere leer</h3>
                <span className="user-books-count">
                  {wantToRead.length} libros
                </span>
              </div>

              {wantToRead.length > 0 ? (
                <div className="user-books-grid">
                  {wantToRead.map((book) => (
                    <div key={book._id} className="user-book-card">
                      <Link
                        to={`/books/${book._id}`}
                        className="user-book-link"
                      >
                        <img
                          src={
                            book.coverImage ||
                            "https://via.placeholder.com/120x180?text=Book"
                          }
                          alt={book.title}
                          className="user-book-cover"
                        />
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="user-empty-text">
                  Su lista de próximas lecturas está vacía por ahora.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;