// components/AddBook.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../config/firebase';

function AddBook() {
    const [title, setTitle] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [library, setLibrary] = useState([]);

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
    };

    const handleAddBookToRead = async (book) => {
        const user = auth.currentUser;
        if (user) {
            const email = user.email;
            const { title, authors, description, imageLinks, categories } = book;
            const newBook = {
                title,
                author: authors ? authors.join(', ') : 'Desconhecido',
                description: description || 'Sem descrição',
                image: imageLinks ? imageLinks.thumbnail : 'Sem imagem',
                genre: categories ? categories.join(', ') : 'Desconhecido'
            };
            try {
                await axios.post('https://books-server-6x8r.onrender.com/booksread', { email, book: newBook });
                console.log('Livro adicionado aos livros lidos:', newBook);
                setSelectedBook(newBook);
                setTitle('');
                setSearchResults([]);
            } catch (error) {
                console.error('Erro ao adicionar livro aos livros lidos:', error);
            }
        } else {
            console.error('Usuário não autenticado');
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

                {searchResults.length > 0 && (
                    <div>
                      <h4>Resultados da Pesquisa:</h4>
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
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
                                            <td>{book.title}</td>
                                            <td>{book.authors ? book.authors.join(', ') : 'Desconhecido'}</td>
                                            <td>{book.description?.substring(0, 100) || 'Sem descrição'}</td>
                                            <td>{book.categories ? book.categories.join(', ') : 'Desconhecido'}</td>
                                            <td>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleAddBookToRead(book)}
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
                        <p><strong>Imagem:</strong></p>
                        {selectedBook.image !== 'Sem imagem' && <img src={selectedBook.image} alt={selectedBook.title} />}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddBook;
