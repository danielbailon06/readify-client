import "./ProfilePage.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FiMapPin, FiEdit2 } from "react-icons/fi";
import { FaFireAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);

  const [profileUser, setProfileUser] = useState(null);

  const [shelves, setShelves] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [isLoadingShelves, setIsLoadingShelves] = useState(true);

  const [newShelfName, setNewShelfName] = useState("");
  const [newShelfDescription, setNewShelfDescription] = useState("");

  const [editingShelfId, setEditingShelfId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [openAddBookShelfId, setOpenAddBookShelfId] = useState(null);
  const [selectedBookIdByShelf, setSelectedBookIdByShelf] = useState({});

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileBio, setProfileBio] = useState("");
  const [profileLocation, setProfileLocation] = useState("");

  const storedToken = localStorage.getItem("authToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  };

  useEffect(() => {
    if (user) {
      setProfileBio(user.bio || "");
      setProfileLocation(user.location || "");
    }
  }, [user]);

  const loadShelves = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shelves`,
        authConfig
      );
      setShelves(response.data);
    } catch (error) {
      console.log("Error loading shelves:", error);
    }
  };

  const loadBooks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/books`);
      setAllBooks(response.data);
    } catch (error) {
      console.log("Error loading books:", error);
    }
  };

  const loadProfileUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}`
      );
      setProfileUser(response.data);
    } catch (error) {
      console.log("Error loading profile user:", error);
    }
  };

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        setIsLoadingShelves(true);
        await Promise.all([
          loadShelves(),
          loadBooks(),
          loadProfileUser(),
          loadReaderUsers(),
        ]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingShelves(false);
      }
    };

    fetchData();
  }, [user?._id]);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}`,
        {
          username: user.username,
          email: user.email,
          profileImage: user.profileImage || "",
          bio: profileBio,
          location: profileLocation,
        },
        authConfig
      );

      setUser(response.data);
      setProfileUser((prev) => ({
        ...prev,
        ...response.data,
      }));
      setIsEditingProfile(false);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  const handleCancelProfileEdit = () => {
    setProfileBio(user?.bio || "");
    setProfileLocation(user?.location || "");
    setIsEditingProfile(false);
  };

  const handleCreateShelf = async (e) => {
    e.preventDefault();

    if (!newShelfName.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shelves`,
        {
          name: newShelfName,
          description: newShelfDescription,
        },
        authConfig
      );

      setShelves((prev) => [response.data, ...prev]);
      setNewShelfName("");
      setNewShelfDescription("");
    } catch (error) {
      console.log("Error creating shelf:", error);
    }
  };

  const startEditingShelf = (shelf) => {
    setEditingShelfId(shelf._id);
    setEditName(shelf.name || "");
    setEditDescription(shelf.description || "");
  };

  const cancelEditingShelf = () => {
    setEditingShelfId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleUpdateShelf = async (shelfId) => {
    if (!editName.trim()) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shelves/${shelfId}`,
        {
          name: editName,
          description: editDescription,
        },
        authConfig
      );

      setShelves((prev) =>
        prev.map((shelf) => (shelf._id === shelfId ? response.data : shelf))
      );

      cancelEditingShelf();
    } catch (error) {
      console.log("Error updating shelf:", error);
    }
  };

  const handleDeleteShelf = async (shelfId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shelves/${shelfId}`,
        authConfig
      );

      setShelves((prev) => prev.filter((shelf) => shelf._id !== shelfId));
    } catch (error) {
      console.log("Error deleting shelf:", error);
    }
  };

  const handleAddBookToShelf = async (shelfId) => {
    const selectedBookId = selectedBookIdByShelf[shelfId];

    if (!selectedBookId) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shelves/${shelfId}/books`,
        { bookId: selectedBookId },
        authConfig
      );

      setShelves((prev) =>
        prev.map((shelf) => (shelf._id === shelfId ? response.data : shelf))
      );

      setSelectedBookIdByShelf((prev) => ({
        ...prev,
        [shelfId]: "",
      }));

      setOpenAddBookShelfId(null);
    } catch (error) {
      console.log("Error adding book:", error);
    }
  };

  const handleRemoveBookFromShelf = async (shelfId, bookId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shelves/${shelfId}/books/${bookId}`,
        authConfig
      );

      setShelves((prev) =>
        prev.map((shelf) => (shelf._id === shelfId ? response.data : shelf))
      );
    } catch (error) {
      console.log("Error removing book:", error);
    }
  };

  const getAvailableBooksForShelf = (shelf) => {
    const shelfBookIds = shelf.books?.map((book) => book._id) || [];
    return allBooks.filter((book) => !shelfBookIds.includes(book._id));
  };

  const readingGoal = 50;

  const readBooks = profileUser?.read || [];
  const currentlyReadingBooks = profileUser?.currentlyReading || [];
  const readingProgress = profileUser?.readingProgress || {};

  const completedBooksCount = readBooks.length;
  const currentlyReadingCount = currentlyReadingBooks.length;

  const completedPercentage = Math.min(
    Math.round((completedBooksCount / readingGoal) * 100),
    100
  );

  const totalPagesReadFromRead = readBooks.reduce((total, book) => {
    return total + (book.pages || 0);
  }, 0);

  const totalPagesReadFromCurrent = currentlyReadingBooks.reduce(
    (total, book) => {
      const currentPage = Number(readingProgress[book._id]) || 0;
      return total + currentPage;
    },
    0
  );

  const totalPagesRead = totalPagesReadFromRead + totalPagesReadFromCurrent;

  const genreCount = {};

  readBooks.forEach((book) => {
    if (book.genre && Array.isArray(book.genre)) {
      book.genre.forEach((genre) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    }
  });

  const favoriteGenre =
    Object.keys(genreCount).length > 0
      ? Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0][0]
      : "—";

  const [readerUsers, setReaderUsers] = useState([]);

  const loadReaderUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users`,
        authConfig
      );
      setReaderUsers(response.data);
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };

  const possibleBadges = [
    "Lector destacado",
    "Coleccionista de historias",
    "Devora libros",
    "Amante del romantasy",
    "Explorador de mundos",
    "Lector nocturno",
  ];

  const [badges] = useState(() => {
    return [...possibleBadges]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
  });

  return (
    <div className="profile-page">
      <div className="profile-top-card">
        <div className="profile-avatar-wrapper">
          <img
            src={profileUser?.profileImage || user?.profileImage || "/avatars/avatar5.png"}
            alt="Profile avatar"
            className="profile-avatar"
          />
        </div>

        <div className="profile-top-info">
          {isEditingProfile ? (
            <>
              <div className="profile-info-header">
                <div className="profile-info-text">
                  <h1 className="profile-name">{user?.username || "Usuario"}</h1>
                </div>
              </div>

              <div className="profile-edit-fields">
                <input
                  type="text"
                  className="profile-edit-input"
                  placeholder="Ubicación"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                />

                <textarea
                  className="profile-edit-textarea"
                  placeholder="Escribe tu bio..."
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                />
              </div>

              <div className="profile-edit-actions">
                <button type="button" onClick={handleUpdateProfile}>
                  Guardar
                </button>
                <button type="button" onClick={handleCancelProfileEdit}>
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-info-header">
                <div className="profile-info-text">
                  <h1 className="profile-name">{user?.username || "Usuario"}</h1>

                  <div className="profile-location">
                    <FiMapPin />
                    <span>{user?.location || "Añade tu ubicación"}</span>
                  </div>

                  <p className="profile-bio">
                    {user?.bio || "Añade una bio para contar tu historia ✨"}
                  </p>
                </div>

                <button
                  type="button"
                  className="edit-profile-icon-btn"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <FiEdit2 />
                </button>
              </div>
            </>
          )}

          <div className="profile-badges">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`profile-badge ${index === 0 ? "badge-green" : "badge-peach"
                  }`}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-left-column">
          <div className="section-title-row">
            <h2>
              <FaFireAlt className="section-icon" />
              Un año lleno de historias · {new Date().getFullYear()}
            </h2>
          </div>

          <div className="reading-journey-card">
            <div className="journey-top-row">
              <div className="journey-books">
                <span className="journey-main-number">
                  {completedBooksCount}
                </span>
                <span className="journey-secondary-text">
                  / {readingGoal} libros leídos
                </span>
              </div>

              <div className="journey-complete">
                {completedPercentage}% Completado
              </div>
            </div>

            <div className="journey-progress-bar">
              <div
                className="journey-progress-fill"
                style={{ width: `${completedPercentage}%` }}
              ></div>
            </div>

            <div className="journey-stats">
              <div className="journey-stat">
                <span className="journey-stat-label">En proceso</span>
                <span className="journey-stat-value">
                  {currentlyReadingCount}{" "}
                  {currentlyReadingCount === 1 ? "libro" : "libros"}
                </span>
              </div>

              <div className="journey-stat">
                <span className="journey-stat-label">Páginas leídas</span>
                <span className="journey-stat-value">{totalPagesRead}</span>
              </div>

              <div className="journey-stat">
                <span className="journey-stat-label">Género favorito</span>
                <span className="journey-stat-value">{favoriteGenre}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-right-column">
          <div className="section-title-row friends-title-row">
            <h2>Almas lectoras</h2>
          </div>

          <div className="friends-card">
            {readerUsers.length > 0 ? (
              readerUsers.slice(0, 3).map((reader) => {
                const currentBook = reader.currentlyReading?.[0];
                const lastReadBook = reader.read?.[0];

                return (
                  <Link
                    key={reader._id}
                    to={`/users/${reader._id}`}
                    className="friend-item"
                  >
                    <img
                      src={reader.profileImage || "/avatars/avatar1.png"}
                      alt={reader.username}
                      className="friend-avatar"
                      onError={(e) => {
                        e.target.src = "/avatars/avatar1.png";
                      }}
                    />

                    <div className="friend-info">
                      <h4>{reader.username}</h4>

                      <p>
                        {currentBook
                          ? `Leyendo: ${currentBook.title}`
                          : lastReadBook
                            ? `Leído: ${lastReadBook.title}`
                            : "Aún no ha añadido lecturas"}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="friends-empty-text">
                Todavía no hay otras almas lectoras por aquí.
              </p>
            )}

            <button className="find-friends-btn" onClick={loadReaderUsers}>
              Descubrir lectores
            </button>
          </div>
        </div>
      </div>

      <div className="profile-shelves-section">
        <div className="section-title-row shelves-title-row">
          <h2>Mis estanterías</h2>
        </div>

        <form className="create-shelf-form" onSubmit={handleCreateShelf}>
          <input
            type="text"
            placeholder="Nombre de la estantería"
            value={newShelfName}
            onChange={(e) => setNewShelfName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={newShelfDescription}
            onChange={(e) => setNewShelfDescription(e.target.value)}
          />
          <button type="submit">Crear librería</button>
        </form>

        {isLoadingShelves ? (
          <p className="shelves-loading">Cargando estanterías...</p>
        ) : shelves.length === 0 ? (
          <p className="shelves-empty">
            Tu rincón lector está esperando su primera estantería
          </p>
        ) : (
          <div className="shelves-list">
            {shelves.map((shelf) => {
              const availableBooks = getAvailableBooksForShelf(shelf);

              return (
                <div key={shelf._id} className="shelf-card">
                  {editingShelfId === shelf._id ? (
                    <div className="shelf-edit-box">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Nombre"
                      />
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Descripción"
                      />

                      <div className="shelf-actions">
                        <button
                          type="button"
                          onClick={() => handleUpdateShelf(shelf._id)}
                        >
                          Guardar
                        </button>
                        <button type="button" onClick={cancelEditingShelf}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="shelf-header">
                        <div>
                          <h3>{shelf.name}</h3>
                          {shelf.description && <p>{shelf.description}</p>}
                        </div>

                        <div className="shelf-actions">
                          <button
                            type="button"
                            onClick={() => startEditingShelf(shelf)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteShelf(shelf._id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      <div className="shelf-books-grid">
                        {shelf.books && shelf.books.length > 0 ? (
                          shelf.books.map((book) => (
                            <div key={book._id} className="shelf-book-card">
                              <Link
                                to={`/books/${book._id}`}
                                className="shelf-book-link"
                              >
                                <img
                                  src={
                                    book.coverImage ||
                                    "https://via.placeholder.com/120x180?text=Book"
                                  }
                                  alt={book.title}
                                  className="shelf-book-cover"
                                />
                                <h4>{book.title}</h4>
                                <p>{book.author}</p>
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveBookFromShelf(shelf._id, book._id)
                                }
                              >
                                Quitar
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="shelf-empty-text">
                            No hay libros en esta estantería todavía.
                          </p>
                        )}

                        <div className="add-book-tile">
                          {openAddBookShelfId === shelf._id ? (
                            <div className="add-book-form">
                              <select
                                value={selectedBookIdByShelf[shelf._id] || ""}
                                onChange={(e) =>
                                  setSelectedBookIdByShelf((prev) => ({
                                    ...prev,
                                    [shelf._id]: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Selecciona un libro</option>
                                {availableBooks.map((book) => (
                                  <option key={book._id} value={book._id}>
                                    {book.title} - {book.author}
                                  </option>
                                ))}
                              </select>

                              <button
                                type="button"
                                onClick={() => handleAddBookToShelf(shelf._id)}
                              >
                                Añadir
                              </button>

                              <button
                                type="button"
                                onClick={() => setOpenAddBookShelfId(null)}
                              >
                                Cerrar
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="add-book-button"
                              onClick={() => setOpenAddBookShelfId(shelf._id)}
                            >
                              + Añadir libro
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;