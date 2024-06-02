import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../config/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

function BooksRead() {
    const [booksRead, setBooksRead] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        fetchBooksRead();
    }, []);

    const fetchBooksRead = async () => {
        const user = auth.currentUser;
        if (user) {
            const email = user.email;
            try {
                const response = await axios.get(`https://books-server-6x8r.onrender.com/booksread/${email}`);
                setBooksRead(response.data);
            } catch (error) {
                console.error('Erro ao buscar livros lidos:', error);
            }
        } else {
            console.error('Usuário não autenticado');
        }
    };

    const showBookDetails = (book) => {
        setSelectedBook(book);
    };

    const closeBookDetails = () => {
        setSelectedBook(null);
    };

    const handleShowModal = (book) => {
        setBookToDelete(book);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setBookToDelete(null);
        setConfirmText('');
    };

    const handleDeleteBook = async () => {
        if (confirmText.toLowerCase() === 'sim' && bookToDelete) {
            const user = auth.currentUser;
            if (user) {
                const email = user.email;
                try {
                    await axios.delete(`https://books-server-6x8r.onrender.com/booksread/${email}/${bookToDelete._id}`);
                    setBooksRead(booksRead.filter(book => book._id !== bookToDelete._id));
                    handleCloseModal();
                } catch (error) {
                    console.error('Erro ao excluir o livro lido:', error);
                }
            } else {
                console.error('Usuário não autenticado');
            }
        }
    };

    const isValidURL = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const renderBookImage = (image) => {
        if (isValidURL(image)) {
            return <img src={image} alt="Book Cover" className="card-img-top img-fluid" />;
        } else {
            return (
                <div className="card-img-top img-fluid bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                    Sem imagem
                </div>
            );
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-center mb-4">LIVROS QUE JÁ LEU</h2>
            <div className="container">
                <div className="row">
                    {booksRead.map((book, index) => (
                        <div key={index} className="col-6 col-md-4 col-lg-3 mb-4">
                            <div className="card h-100">
                                {renderBookImage(book.image)}
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title">{book.title}</h5>
                                    <button className="btn btn-primary mt-auto mb-2" onClick={() => showBookDetails(book)}>Detalhes</button>
                                    <button className="btn btn-danger mt-auto" onClick={() => handleShowModal(book)}>Excluir</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
                                {isValidURL(selectedBook.image) ? (
                                    <img src={selectedBook.image} className="img-fluid mb-3" alt="Book Cover" />
                                ) : (
                                    <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                                        Sem imagem
                                    </div>
                                )}
                                <p>{selectedBook.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
}

export default BooksRead;
