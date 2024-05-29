// components/LibraryBooks.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const LibraryBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://books-server-6x8r.onrender.com/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h2 className="text-center my-4">Livros Disponíveis na Biblioteca</h2>
      <div className="container">
        <div className="row">
          {books.map(book => (
            <div key={book._id} className="col-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100">
                {book.imageLinks && book.imageLinks.thumbnail ? (
                  <img src={book.imageLinks.thumbnail} alt={book.title} className="card-img-top img-fluid" />
                ) : (
                  <div className="card-img-top img-fluid bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                    Sem imagem
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryBooks;
