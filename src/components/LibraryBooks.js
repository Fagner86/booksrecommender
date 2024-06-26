import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../config/firebase';
import { Modal, Button, Form } from 'react-bootstrap';

const LibraryBooks = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookToShow, setBookToShow] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [clusters, setClusters] = useState({});
  const [selectedCluster, setSelectedCluster] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const storedBooks = sessionStorage.getItem('libraryBooks');
    const storedClusters = sessionStorage.getItem('libraryClusters');
    const lastFetched = sessionStorage.getItem('lastFetched');

    const shouldFetchNewData = !lastFetched || (Date.now() - new Date(lastFetched));

    if (storedBooks && !shouldFetchNewData) {
      setBooks(JSON.parse(storedBooks));
    } else {
      fetchBooks();
    }

    if (storedClusters && !shouldFetchNewData) {
      setClusters(JSON.parse(storedClusters));
    } else {
      fetchClusters();
    }

    if (shouldFetchNewData) {
      sessionStorage.setItem('lastFetched', new Date().toISOString());
    }
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://books-server-6x8r.onrender.com/books');
      setBooks(response.data);
      sessionStorage.setItem('libraryBooks', JSON.stringify(response.data));
      console.log('Books fetched and stored in sessionStorage');
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClusters = async () => {
    try {
      const response = await axios.get('https://books-server-6x8r.onrender.com/clusterBooks');
      const clustersData = response.data;
      setClusters(clustersData);
      sessionStorage.setItem('libraryClusters', JSON.stringify(clustersData));
      console.log('Clusters fetched and stored in sessionStorage');
    } catch (error) {
      console.error('Error fetching clusters:', error);
    }
  };

  const handleShowModal = (book) => {
    setBookToShow(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBookToShow(null);
    setBookToDelete(null);
    setConfirmText('');
  };

  const handleDeleteBook = async () => {
    if (confirmText.toLowerCase() === 'sim' && bookToDelete) {
      try {
        await axios.delete(`https://books-server-6x8r.onrender.com/books/${bookToDelete}`);
        const updatedBooks = books.filter(book => book._id !== bookToDelete);
        setBooks(updatedBooks);
        sessionStorage.setItem('libraryBooks', JSON.stringify(updatedBooks));
        handleCloseModal();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleClusterSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedCluster(selectedValue === "null" ? null : selectedValue);
  };

  const filteredBooks = selectedCluster !== null ? clusters[selectedCluster] || [] : books.map(book => book._id);

  return (
    <div>
      <h2 className="text-center my-4">Livros Disponíveis na Biblioteca</h2>
      <div className="container">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <Form.Select onChange={handleClusterSelect} className="mb-4">
              <option value="null">Todos os Livros</option>
              {Object.entries(clusters).map(([clusterName, bookIds]) => (
                <option key={clusterName} value={clusterName}>{clusterName}</option>
              ))}
            </Form.Select>

            <div className="row">
              {filteredBooks.map((bookId) => {
                const book = books.find(b => b._id === bookId);
                if (!book) {
                  return null;
                }
                return (
                  <div key={book._id} className="col-6 col-md-4 col-lg-3 mb-4">
                    <div className="card h-100 d-flex flex-column">
                      <div className="text-center" style={{ minHeight: '150px' }}>
                        {book.imageLinks && book.imageLinks.thumbnail ? (
                          <img src={book.imageLinks.thumbnail} alt={book.title} className="card-img-top img-fluid" />
                        ) : (
                          <div className="card-img-top img-fluid bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                            Sem imagem
                          </div>
                        )}
                      </div>
                      <div className="card-body d-flex flex-column justify-content-between">
                        <h5 className="card-title">{book.title}</h5>
                        <button className="btn btn-info w-100 mb-2 mt-auto" onClick={() => handleShowModal(book)}>
                          Detalhes
                        </button>
                        {user && user.email.endsWith('@alu.uern.br') && (
                          <button className="btn btn-danger w-100" onClick={() => {
                            setBookToDelete(book._id);
                            handleShowModal(book);
                          }}>
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      {bookToShow && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{bookToDelete ? 'Confirmar Exclusão' : 'Detalhes do Livro'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {bookToDelete ? (
              <>
                <p>Tem certeza que deseja excluir este livro? Digite <strong>sim</strong> para confirmar:</p>
                <Form.Control
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Digite 'sim' para confirmar"
                />
              </>
            ) : (
              <>
                <div className="text-center mb-3">
                  <img src={bookToShow.imageLinks?.thumbnail} alt={bookToShow.title} className="img-fluid" style={{ width: '100px', height: 'auto' }} />
                </div>
                <p><strong>Título:</strong> {bookToShow.title}</p>
                <p><strong>Autor:</strong> {bookToShow.authors ? bookToShow.authors.join(', ') : 'Desconhecido'}</p>
                <p><strong>Descrição:</strong> {bookToShow.description || 'Sem descrição'}</p>
                <p><strong>Gênero:</strong> {bookToShow.categories ? bookToShow.categories.join(', ') : 'Desconhecido'}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              {bookToDelete ? 'Cancelar' : 'Fechar'}
            </Button>
            {bookToDelete && (
              <Button variant="danger" onClick={handleDeleteBook} disabled={confirmText.toLowerCase() !== 'sim'}>
                Excluir
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default LibraryBooks;
