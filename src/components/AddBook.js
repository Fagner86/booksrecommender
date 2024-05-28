import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddBook() {
  const [title, setTitle] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    // Fetch library data from your database or API
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    // Substitua com a lógica para buscar os dados do acervo da sua biblioteca
    // Exemplo fictício:
    const response = await axios.get('');
    setLibrary(response.data);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const results = library.filter(book => 
      book.title.toLowerCase().includes(title.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddBook = (book) => {
    console.log('Marking book as read:', book);
    // Adicione lógica para marcar o livro como lido no banco de dados aqui
    setSelectedBook(book);
    setTitle('');
    setSearchResults([]);
  };

  return (
    <div className="mt-4">
      <h2>Adicionar Livro</h2>
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
        <div className="mt-4">
          <h4>Resultados da Pesquisa:</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Descrição</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.description?.substring(0, 100) || 'Sem descrição'}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleAddBook(book)}
                    >
                      Marcar como Lido
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBook && (
        <div className="mt-4">
          <h4>Livro Marcado como Lido:</h4>
          <p><strong>Título:</strong> {selectedBook.title}</p>
          <p><strong>Autor:</strong> {selectedBook.author}</p>
          <p><strong>Descrição:</strong> {selectedBook.description}</p>
        </div>
      )}
    </div>
  );
}

export default AddBook;
