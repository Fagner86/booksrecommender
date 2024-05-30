import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../config/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';

function BookSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [bookDetails, setBookDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      setLoading(true);
      try {
        const response = await axios.get(`https://books-server-6x8r.onrender.com/generateRecommendations/${email}`);
        setSuggestions(response.data.suggestions);
        fetchAllBookDetails(response.data.suggestions);
      } catch (error) {
        console.error('Erro ao buscar sugestões de livros:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('Usuário não autenticado');
    }
  };

  const fetchAllBookDetails = async (titles) => {
    const promises = titles.map(title => fetchBookDetails(title));
    const books = await Promise.all(promises);
    setBookDetails(books.filter(book => book !== null));
  };

  const fetchBookDetails = async (title) => {
    try {
      const response = await axios.get(`https://books-server-6x8r.onrender.com/books_titulo?title=${encodeURIComponent(title)}`);
      return response.data[0]; // Retorna o primeiro livro encontrado, ou undefined se a lista estiver vazia
    } catch (error) {
      console.error('Erro ao buscar detalhes do livro:', error);
      return null; // Retorna null em caso de erro para facilitar a filtragem posterior
    }
  };

  const renderBookImage = (book) => {
    if (book.imageLinks && book.imageLinks.thumbnail) {
      return <img src={book.imageLinks.thumbnail} alt={book.title} className="card-img-top img-fluid" style={{ height: 'auto', objectFit: 'cover' }} />;
    } else {
      return (
        <div className="card-img-top bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
          Sem imagem
        </div>
      );
    }
  };

  const showBookDetails = (book) => {
    setSelectedBook(book);
  };

  const closeBookDetails = () => {
    setSelectedBook(null);
  };

  return (
    <div className="mt-4">
      <h2 className="text-center mb-4">Sugestões de Livros com Base nos Livros que Você Já Leu</h2>
      <div className="container">
        {loading ? (
          <p>Carregando sugestões...</p>
        ) : bookDetails.length ? (
          <Carousel
            indicators={true}
            nextIcon={<span className="carousel-control-next-icon" aria-hidden="true" style={{ backgroundColor: 'black' }}></span>}
            prevIcon={<span className="carousel-control-prev-icon" aria-hidden="true" style={{ backgroundColor: 'black' }}></span>}
          >
            {bookDetails.map((book, index) => (
              <Carousel.Item key={index}>
                <div className="card h-100 mx-auto" style={{ maxWidth: '300px' }}>
                  {renderBookImage(book)}
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">{book.title}</h5>
                    <button className="btn btn-primary mt-auto" onClick={() => showBookDetails(book)}>Detalhes</button>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <p>Nenhuma recomendação disponível.</p>
        )}
      </div>
      {selectedBook && (
        <div className="modal" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedBook.title}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeBookDetails}></button>
              </div>
              <div className="modal-body">
                {selectedBook.imageLinks && selectedBook.imageLinks.thumbnail ? (
                  <img src={selectedBook.imageLinks.thumbnail} className="img-fluid mb-3" alt="Book Cover" />
                ) : (
                  <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                    Sem imagem
                  </div>
                )}
                <p>{selectedBook.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookSuggestions;
