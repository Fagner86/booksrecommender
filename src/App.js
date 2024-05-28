import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddBook from './components/AddBook';
import BookSuggestions from './components/BookSuggestions';

function App() {
  const [showAddBook, setShowAddBook] = useState(false);

  const toggleAddBookForm = () => {
    setShowAddBook(!showAddBook);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
        <div className="container-fluid">
          <h1 className="navbar-brand" >Book Recommender</h1>
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
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <button
                  className="btn btn-outline-primary"
                  onClick={toggleAddBookForm}
                >
                  {showAddBook ? 'Fechar' : 'Adicionar livro que já Leu'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="App container mt-4">
        {showAddBook ? <AddBook /> : <BookSuggestions />}
      </div>
    </div>
  );
}

export default App;
