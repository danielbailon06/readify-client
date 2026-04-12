import { useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthContext } from "./context/auth.context";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import BookPage from "./pages/BookPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import LibraryPage from "./pages/LibraryPage";
import ShelfDetailsPage from "./pages/ShelfDetailsPage";

function App() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={isLoggedIn ? <HomePage /> : <WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/books" element={<BookPage />} />
        <Route path="/books/:bookId" element={<BookDetailsPage />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/library"
          element={
            <PrivateRoute>
              <LibraryPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/shelves/:shelfId"
          element={
            <PrivateRoute>
              <ShelfDetailsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;