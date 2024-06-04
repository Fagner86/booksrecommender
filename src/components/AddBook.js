import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../config/firebase';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando Bootstrap
import { Modal, Button, Alert } from 'react-bootstrap'; // Importando componentes do Bootstrap

function AddBook() {
    const [title, setTitle] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [library, setLibrary] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [bookToAdd, setBookToAdd] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        fetchLibrary(); // Fetch library data from the server
    }, []);

    const fetchLibrary = async () => {
        try {
            const response = await axios.get('https://books-server-6x8r.onrender.com/books');
            setLibrary(response.data);
            setSearchResults(response.data); // Initialize search results with all library books
        } catch (error) {
            console.error('Error fetching library:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const results = library.filter(book =>
            book.title.toLowerCase().includes(title.toLowerCase())
        );
        setSearchResults(results);
        setSelectedBook(null);
    };

    const handleShowModal = (book) => {
        setBookToAdd(book);
        setShowModal(true);
    };

    const handleAddBookToRead = async () => {
        const user = auth.currentUser;
        if (user && bookToAdd) {
            const email = user.email;
            const {_id,title, authors, description, imageLinks, categories } = bookToAdd;
            const newBook = {
                title,
                refIdBook: _id,
                author: authors ? authors.join(', ') : 'Desconhecido',
                description: description || 'Sem descrição',
                image: imageLinks ? imageLinks.thumbnail : 'Sem imagem',
                genre: categories ? categories.join(', ') : 'Desconhecido'
            };
            try {
                await axios.post('https://books-server-6x8r.onrender.com/booksread', { email, book: newBook });
                console.log('Livro adicionado aos livros lidos:', newBook);
                setSelectedBook(newBook);
                setShowModal(false);
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
                setTitle('');
                setSearchResults([]);
            } catch (error) {
                console.error('Erro ao adicionar livro aos livros lidos:', error);
            }
        } else {
            console.error('Usuário não autenticado ou livro não selecionado');
        }
    };

    return (
        <div>
            <div className="mt-4">
                <h2>Adicionar Lívros que já Leu</h2>
                <form onSubmit={handleSearch}>
                    <div className="mb-3">
                        <label className="form-label">Título</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Pesquisar</button>
                </form>

                {showAlert && (
                    <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                        Livro adicionado com sucesso!
                    </Alert>
                )}

                {searchResults.length > 0 && (
                    <div>
                        <h4>Resultados da Pesquisa:</h4>
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th className="text-center"></th>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Descrição</th>
                                        <th>Gênero</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((book, index) => (
                                        <tr key={index}>
                                            <td className="text-center">
                                                <img src={book.imageLinks?.thumbnail} alt={book.title} className="img-fluid" style={{ width: '50px', height: 'auto' }} />
                                            </td>
                                            <td>{book.title}</td>
                                            <td>{book.authors ? book.authors.join(', ') : 'Desconhecido'}</td>
                                            <td>{book.description?.substring(0, 100) || 'Sem descrição'}</td>
                                            <td>{book.categories ? book.categories.join(', ') : 'Desconhecido'}</td>
                                            <td>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleShowModal(book)}
                                                >
                                                    Adicionar aos Livros Lidos
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {selectedBook && (
                    <div className="mt-4">
                        <h4>Livro Marcado como Lido:</h4>
                        <p><strong>Título:</strong> {selectedBook.title}</p>
                        <p><strong>Autor:</strong> {selectedBook.author}</p>
                        <p><strong>Descrição:</strong> {selectedBook.description}</p>
                        <p><strong>Gênero:</strong> {selectedBook.genre}</p>
                        <p><strong></strong></p>
                        {selectedBook.image !== 'Sem imagem' && <img src={selectedBook.image} alt={selectedBook.title} />}
                    </div>
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmação</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza que deseja adicionar este livro aos livros lidos?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAddBookToRead}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AddBook;
