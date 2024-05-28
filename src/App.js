// App.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from './config/firebase';
import { signOutUser } from './config/auth/auth';
import AddBook from './components/AddBook';
import BookSuggestions from './components/BookSuggestions';
import BooksRead from './components/BookRead';
import ManageLibrary from './components/ManageLibrary';
import LoginForm from './components/LoginForm';

function App() {
  const [user, setUser] = useState(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showManageLibrary, setShowManageLibrary] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const toggleAddBookForm = () => {
    setShowAddBook(!showAddBook);
    setShowManageLibrary(false);
  };

  const toggleManageLibrary = () => {
    setShowManageLibrary(!showManageLibrary);
    setShowAddBook(false);
  };

  const handleLogin = () => {
    setUser(auth.currentUser);
  };

  return (
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
                  <li className="nav-item active flex-fill">
                    <button className="btn btn-outline-primary w-100" onClick={toggleAddBookForm}>
                      {showAddBook ? 'Fechar' : 'Adicionar livro que já Leu'}
                    </button>
                  </li>
                  <li className="nav-item flex-fill">
                    <button className="btn btn-outline-primary w-100" onClick={toggleManageLibrary}>
                      {showManageLibrary ? 'Fechar' : 'Gerenciar Biblioteca'}
                    </button>
                  </li>
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
            {showAddBook && <AddBook />}
            {showManageLibrary && <ManageLibrary />}
            {!showAddBook && !showManageLibrary && (
              <>
                <BookSuggestions />
                <BooksRead />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
