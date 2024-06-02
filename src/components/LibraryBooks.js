import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../config/firebase';
import { Modal, Button, Form } from 'react-bootstrap';

const LibraryBooks = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const user = auth.currentUser;

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

  const handleShowModal = (bookId) => {
    setBookToDelete(bookId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBookToDelete(null);
    setConfirmText('');
  };

  const handleDeleteBook = async () => {
    if (confirmText.toLowerCase() === 'sim' && bookToDelete) {
      try {
        await axios.delete(`https://books-server-6x8r.onrender.com/books/${bookToDelete}`);
        setBooks(books.filter(book => book._id !== bookToDelete));
        handleCloseModal();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-center my-4">Livros Disponíveis na Biblioteca</h2>
      <div className="container">
        <div className="row">
          {books.map(book => (
            <div key={book._id} className="col-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100 d-flex flex-column">
                {book.imageLinks && book.imageLinks.thumbnail ? (
                  <img src={book.imageLinks.thumbnail} alt={book.title} className="card-img-top img-fluid" />
                ) : (
                  <div className="card-img-top img-fluid bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                    Sem imagem
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book.title}</h5>
                  {user && user.email.endsWith('@alu.uern.br') && (
                    <div className="mt-auto">
                      <button className="btn btn-danger w-100" onClick={() => handleShowModal(book._id)}>
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja excluir este livro? Digite <strong>sim</strong> para confirmar:</p>
          <Form.Control 
            type="text" 
            value={confirmText} 
            onChange={(e) => setConfirmText(e.target.value)} 
            placeholder="Digite 'sim' para confirmar" 
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteBook} disabled={confirmText.toLowerCase() !== 'sim'}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LibraryBooks;
