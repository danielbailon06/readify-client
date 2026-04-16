import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import {
  FiBookOpen,
  FiCloudRain,
  FiCoffee,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  GiSpellBook,
  GiHeartBeats,
  GiMagnifyingGlass,
  GiSparkles,
  GiCampfire,
} from "react-icons/gi";
import "./HomePage.css";

function HomePage() {
  const { user } = useContext(AuthContext);
  const [homeUser, setHomeUser] = useState(null);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);

  const getHour = () => {
    const hour = new Date().getHours();
    if (hour < 15) return "Buenos días";
    if (hour < 20) return "Buenas tardes";
    return "Buenas noches";
  };

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`)
      .then((response) => {
        setHomeUser(response.data);
      })
      .catch((error) => {
        console.log("Error cargando home user:", error);
      });
  }, [user]);

  if (!user) {
    return null;
  }

  const currentlyReadingBooks = homeUser?.currentlyReading || [];

  useEffect(() => {
    if (currentBookIndex > currentlyReadingBooks.length - 1) {
      setCurrentBookIndex(0);
    }
  }, [currentlyReadingBooks.length, currentBookIndex]);

  const currentBook = currentlyReadingBooks[currentBookIndex] || null;

  const currentPage = currentBook
    ? Number(homeUser?.readingProgress?.[currentBook._id] || 0)
    : 0;

  const progress = currentBook?.pages
    ? Math.min(Math.round((currentPage / currentBook.pages) * 100), 100)
    : 0;

  const goToPreviousBook = () => {
    setCurrentBookIndex((prev) =>
      prev === 0 ? currentlyReadingBooks.length - 1 : prev - 1
    );
  };

  const goToNextBook = () => {
    setCurrentBookIndex((prev) =>
      prev === currentlyReadingBooks.length - 1 ? 0 : prev + 1
    );
  };

  const completedBooks = homeUser?.read?.length || 0;

  const readingMoods = [
    {
      title: "Fantasioso",
      description:
        "Para perderte entre magia, criaturas imposibles y mundos que se sienten infinitos.",
      icon: <GiSpellBook />,
      genre: "Fantasía",
      cardClass: "mood-fantasy",
    },
    {
      title: "Romántico",
      description:
        "Historias que se leen con el corazón blandito, tensión bonita y personajes que se encuentran.",
      icon: <GiHeartBeats />,
      genre: "Romance",
      cardClass: "mood-romance",
    },
    {
      title: "Misterioso",
      description:
        "Secretos, giros y libros que te hacen decir una página más… y otra… y otra.",
      icon: <GiMagnifyingGlass />,
      genre: "Misterio",
      cardClass: "mood-mystery",
    },
    {
      title: "Soñador",
      description:
        "Lecturas suaves, especiales y llenas de esa chispa que convierte un rato en refugio.",
      icon: <GiSparkles />,
      genre: "Ficción",
      cardClass: "mood-dreamy",
    },
  ];

  const [time, setTime] = useState(30);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [activeSound, setActiveSound] = useState("");
  const [volume, setVolume] = useState(0.4);

  const timerRef = useRef(null);

  const rainAudioRef = useRef(null);
  const fireAudioRef = useRef(null);
  const cafeAudioRef = useRef(null);

  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeChange = (e) => {
    const newTime = Number(e.target.value);
    setTime(newTime);
    if (!isRunning) {
      setSecondsLeft(newTime * 60);
    }
  };

  const startTimer = () => {
    if (isRunning) return;

    setIsRunning(true);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setSecondsLeft(time * 60);
  };

  const totalSeconds = time * 60;

  const timerProgress =
    totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;

  const stopAllSounds = () => {
    [rainAudioRef, fireAudioRef, cafeAudioRef].forEach((audioRef) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    });
    setActiveSound("");
  };

  const toggleSound = async (soundName) => {
    const soundMap = {
      rain: rainAudioRef,
      fire: fireAudioRef,
      cafe: cafeAudioRef,
    };

    const selectedAudio = soundMap[soundName]?.current;

    if (!selectedAudio) return;

    if (activeSound === soundName) {
      selectedAudio.pause();
      selectedAudio.currentTime = 0;
      setActiveSound("");
      return;
    }

    [rainAudioRef, fireAudioRef, cafeAudioRef].forEach((audioRef) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    });

    selectedAudio.volume = volume;
    selectedAudio.loop = true;

    try {
      await selectedAudio.play();
      setActiveSound(soundName);
    } catch (error) {
      console.log("Error reproduciendo sonido:", error);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);

    [rainAudioRef, fireAudioRef, cafeAudioRef].forEach((audioRef) => {
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    });
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      [rainAudioRef, fireAudioRef, cafeAudioRef].forEach((audioRef) => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      });
    };
  }, []);

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>
          {getHour()}
          {user ? `, ${user.username}.` : ""}
        </h1>
        <p>Tu té humea… y tu estantería te echa de menos.</p>
      </div>

      <div className="home-main-grid">
        <div className="home-currently-card">
          {currentBook ? (
            <div className="currently-slider-wrapper">
              {currentlyReadingBooks.length > 1 && (
                <button
                  type="button"
                  onClick={goToPreviousBook}
                  aria-label="Libro anterior"
                  className="slider-arrow"
                >
                  <FiChevronLeft />
                </button>
              )}

              <div className="currently-slider-content">
                <div className="home-currently-cover">
                  <img
                    src={
                      currentBook.coverImage ||
                      "https://via.placeholder.com/160x240?text=No+Cover"
                    }
                    alt={currentBook.title}
                  />
                </div>

                <div className="home-currently-content">
                  <span className="home-currently-label">LEYENDO AHORA</span>

                  <h2>{currentBook.title}</h2>
                  <p className="home-currently-author">
                    por {currentBook.author}
                  </p>

                  <div className="home-progress-top">
                    <span>{progress}% completado</span>
                    <span>
                      Página {currentPage} de {currentBook.pages || 0}
                    </span>
                  </div>

                  <div className="home-progress-bar">
                    <div
                      className="home-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <Link
                    to={`/books/${currentBook._id}`}
                    className="home-continue-link"
                  >
                    <button className="home-continue-btn">
                      Seguir leyendo
                    </button>
                  </Link>

                  {currentlyReadingBooks.length > 1 && (
                    <div className="slider-dots">
                      {currentlyReadingBooks.map((book, index) => (
                        <button
                          key={book._id}
                          type="button"
                          aria-label={`Ir al libro ${index + 1}`}
                          onClick={() => setCurrentBookIndex(index)}
                          className={`slider-dot ${
                            index === currentBookIndex ? "active" : ""
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {currentlyReadingBooks.length > 1 && (
                <button
                  type="button"
                  onClick={goToNextBook}
                  aria-label="Libro siguiente"
                  className="slider-arrow"
                >
                  <FiChevronRight />
                </button>
              )}
            </div>
          ) : (
            <div className="home-empty-currently">
              <h2>No estás leyendo ningún libro ahora mismo</h2>
              <p>Tu próxima historia te está esperando.</p>
              <Link to="/library" className="home-continue-link">
                <button className="home-continue-btn">
                  Ir a mi biblioteca
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="home-month-card">
          <div className="home-month-header">
            <FiBookOpen className="home-month-icon" />
            <h3>Meta mensual</h3>
          </div>

          <p>
            {completedBooks === 0 &&
              "Aún no has empezado este mes… ¿buscamos tu próxima lectura? ✨📖"}

            {completedBooks === 1 &&
              "Buen comienzo ✨ ya has leído tu primer libro del mes 📖"}

            {completedBooks >= 2 &&
              completedBooks < 5 &&
              `Has leído ${completedBooks} de 5 libros este mes. Vas por buen camino ✨`}

            {completedBooks >= 5 &&
              "Increíble 😮‍🔥 ya has alcanzado tu objetivo mensual. ¡Sigue con ese ritmo!"}
          </p>
        </div>
      </div>

      <div className="home-moods-section">
        <div className="home-moods-header">
          <h2>Según como te sientas</h2>
        </div>

        <div className="home-moods-grid">
          {readingMoods.map((mood) => (
            <Link
              key={mood.title}
              to={`/books?genre=${encodeURIComponent(mood.genre)}`}
              className="home-mood-card-link"
            >
              <div className={`home-mood-card ${mood.cardClass}`}>
                <div className="home-mood-icon">{mood.icon}</div>
                <h3>{mood.title}</h3>
                <p>{mood.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="home-nook-section">
        <div className="home-nook-header">
          <h2>Tu rincón de lectura</h2>
          <span>UN MOMENTO SOLO PARA TI</span>
        </div>

        <div className="home-nook-grid">
          <div className="nook-card sound-card">
            <h3>Paisaje sonoro</h3>

            <div className="sound-buttons">
              <button
                className={
                  activeSound === "rain" ? "sound-btn active" : "sound-btn"
                }
                onClick={() => toggleSound("rain")}
                type="button"
              >
                <FiCloudRain />
                <span>Lluvia</span>
              </button>

              <button
                className={
                  activeSound === "fire" ? "sound-btn active" : "sound-btn"
                }
                onClick={() => toggleSound("fire")}
                type="button"
              >
                <GiCampfire />
                <span>Chimenea</span>
              </button>

              <button
                className={
                  activeSound === "cafe" ? "sound-btn active" : "sound-btn"
                }
                onClick={() => toggleSound("cafe")}
                type="button"
              >
                <FiCoffee />
                <span>Café</span>
              </button>
            </div>

            <div className="sound-controls">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
              <button
                type="button"
                className="sound-stop-btn"
                onClick={stopAllSounds}
              >
                Detener
              </button>
            </div>
          </div>

          <div className="nook-card timer-card">
            <h3>Temporizador de concentración</h3>

            <select
              className="timer-select"
              value={time}
              onChange={handleTimeChange}
              disabled={isRunning}
            >
              <option value={15}>15 min</option>
              <option value={20}>20 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
            </select>

            <div
              className="timer-circle"
              style={{
                background: `conic-gradient(
                  #b9643c 0%,
                  #b9643c ${timerProgress}%,
                  #eadfd6 ${timerProgress}%,
                  #eadfd6 100%
                )`,
              }}
            >
              <div className="timer-circle-inner">
                <span>{formatTime()}</span>
              </div>
            </div>

            <div className="timer-actions">
              {!isRunning ? (
                <button
                  type="button"
                  className="timer-main-btn"
                  onClick={startTimer}
                >
                  Empezar sesión
                </button>
              ) : (
                <button
                  type="button"
                  className="timer-main-btn"
                  onClick={pauseTimer}
                >
                  Pausar
                </button>
              )}

              <button
                type="button"
                className="timer-secondary-btn"
                onClick={resetTimer}
              >
                Reiniciar
              </button>
            </div>
          </div>

          <div className="nook-card quote-card">
            <img
              src="https://img.freepik.com/fotos-premium/libros-taza-te-bufanda-hojas-otono-sobre-mesa-madera_392895-409254.jpg"
              alt="Rincón de lectura"
            />
            <div className="quote-overlay">
              <p>“Un libro es un sueño que sostienes entre las manos.”</p>
            </div>
          </div>
        </div>

        <div className="tea-section">
          <div className="tea-section-header">
            <h2>Tés para acompañar tu lectura</h2>
          </div>

          <div className="tea-featured-card">
            <div className="tea-featured-icon">
              <FiCoffee />
            </div>

            <div className="tea-featured-content">
              <span className="tea-match-label">MARIDAJE DEL DÍA</span>
              <h3>Manzanilla con miel</h3>
              <p>
                Una infusión suave y reconfortante para lecturas tranquilas,
                pausadas y de esas que apetece saborear sin prisa.
              </p>
            </div>

            <a
              href="https://www.myrealfood.app/es/recipe/mhnEWn71Tpq2iZKwLUDu"
              target="_blank"
              rel="noreferrer"
            >
              <button type="button" className="tea-featured-btn">
                Preparar
              </button>
            </a>
          </div>

          <div className="tea-grid">
            <a
              href="https://www.myrealfood.app/es/recipe/SxFdoyPcTuZnvq3V9XTZ"
              target="_blank"
              rel="noreferrer"
              className="tea-link"
            >
              <div className="tea-card">
                <div className="tea-card-icon">☕</div>
                <h4>Earl Grey para misterio</h4>
                <p>
                  Cítrico e intenso, perfecto para seguir pistas y perderte en
                  giros inesperados.
                </p>
              </div>
            </a>

            <a
              href="https://www.myrealfood.app/es/recipe/z58aJycv1ARmiNzoFcG7"
              target="_blank"
              rel="noreferrer"
              className="tea-link"
            >
              <div className="tea-card">
                <div className="tea-card-icon">✿</div>
                <h4>Matcha para aprender</h4>
                <p>
                  Enérgico pero sereno, ideal para ensayos, subrayados y
                  lecturas más profundas.
                </p>
              </div>
            </a>

            <a
              href="https://www.myrealfood.app/es/recipe/Msqdp2kDeDnukskQasMe"
              target="_blank"
              rel="noreferrer"
              className="tea-link"
            >
              <div className="tea-card">
                <div className="tea-card-icon">✨</div>
                <h4>Menta para aventura</h4>
                <p>
                  Fresca y ligera, acompaña genial historias rápidas,
                  fantásticas y llenas de movimiento.
                </p>
              </div>
            </a>
          </div>
        </div>

        <audio ref={rainAudioRef} src="/sounds/rain.mp3" preload="auto" />
        <audio ref={fireAudioRef} src="/sounds/fire.mp3" preload="auto" />
        <audio ref={cafeAudioRef} src="/sounds/cafe.mp3" preload="auto" />
      </div>
    </div>
  );
}

export default HomePage;