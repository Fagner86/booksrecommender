import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from './config/firebase';
import { signOutUser } from './config/auth/auth';
import AddBook from './components/AddBook';
import BookSuggestions from './components/BookSuggestions';
import BooksRead from './components/BookRead';
import ManageLibrary from './components/ManageLibrary';
import LibraryBooks from './components/LibraryBooks';
import LoginForm from './components/LoginForm';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => {
    setUser(auth.currentUser);
  };

  return (
    <Router>
      <div>
        {!user ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
              <div className="container-fluid">
                <h1 className="navbar-brand">Book Recommender</h1>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav flex-fill">
                    {!user.email.endsWith('@alu.uern.br') && (
                      <li className="nav-item active flex-fill">
                        <Link className="btn btn-outline-primary w-100" to="/home">
                          Home
                        </Link>
                      </li>
                    )}
                    {!user.email.endsWith('@alu.uern.br') && (
                      <li className="nav-item active flex-fill">
                        <Link className="btn btn-outline-primary w-100" to="/add-book">
                          Adicionar livro que já Leu
                        </Link>
                      </li>
                    )}
                    <li className="nav-item flex-fill">
                      <Link className="btn btn-outline-primary w-100" to="/library-books">
                        Ver Livros da Biblioteca
                      </Link>
                    </li>
                    {user.email.endsWith('@alu.uern.br') && (
                      <li className="nav-item flex-fill">
                        <Link className="btn btn-outline-primary w-100" to="/manage-library">
                          Gerenciar Biblioteca
                        </Link>
                      </li>
                    )}
                    <li className="nav-item">
                      <button className="btn btn-outline-primary" onClick={signOutUser}>
                        Sair
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            <div className="App container mt-4">
              <Routes>
                <Route path="/add-book" element={<AddBook />} />
                <Route path="/manage-library" element={<ManageLibrary />} />
                <Route path="/library-books" element={<LibraryBooks />} />
                <Route path="/home" element={<Home user={user} />} />
                <Route
                  path="/"
                  element={user.email.endsWith('@alu.uern.br') ? <LibraryBooks /> : <Home user={user} />}
                />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

function Home({ user }) {
  return (
    <>
      {!user.email.endsWith('@alu.uern.br') && (
        <>
          <BookSuggestions />
          <BooksRead />
        </>
      )}
      {user.email.endsWith('@alu.uern.br') && (
        <LibraryBooks />
      )}
    </>
  );
}

export default App;
