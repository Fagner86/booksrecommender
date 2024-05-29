import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

function BooksRead() {
    const [booksRead, setBooksRead] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        fetchBooksRead();
    }, []);

    const fetchBooksRead = async () => {
        const user = auth.currentUser;
        if (user) {
            const email = user.email;
            const booksServerUrl = process.env.REACT_APP_BOOKS_READ_GET;
            try {
                const response = await axios.get(`${booksServerUrl}/booksread/${email}`);
                setBooksRead(response.data);
            } catch (error) {
                console.error('Erro ao buscar livros lidos:', error);
            }
        } else {
            console.error('Usuário não autenticado');
        }
    };

    const renderBookImage = (image) => {
        if (image && isValidURL(image)) {
            return <img src={image} className="card-img-top" alt="Book Cover" />;
        } else {
            return (
                <div className="card-img-placeholder">
                    <FontAwesomeIcon icon={faBook} className="fa-10x" />
                </div>
            );
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

    const showBookDetails = (book) => {
        setSelectedBook(book);
    };

    const closeBookDetails = () => {
        setSelectedBook(null);
    };

    return (
        <div className="mt-4">
            <h2 className="text-center mb-4">Livros Lidos</h2>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {booksRead.map((book, index) => (
                    <div key={index} className="col">
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h5 className="card-title">{book.title}</h5>
                                <div className="card-img-container mb-3">
                                    {renderBookImage(book.image)}
                                </div>
                                <button className="btn btn-primary" onClick={() => showBookDetails(book)}>Detalhes</button>
                            </div>
                        </div>
                    </div>
                ))}
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
                                <img src={selectedBook.image} className="img-fluid mb-3" alt="Book Cover" />
                                <p>{selectedBook.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BooksRead;
