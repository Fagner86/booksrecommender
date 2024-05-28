import React, { useState } from 'react';
import axios from 'axios';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const results = await fetchGoogleBooksData(title);
    setSearchResults(results);
  };

  const fetchGoogleBooksData = async (title) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`);
      return response.data.items.map(item => item.volumeInfo);
    } catch (error) {
      console.error('Error fetching book data:', error);
      return [];
    }
  };

  const handleAddBook = (book) => {
    console.log('Adding book to library:', book);
    // Adicione lógica para salvar o livro no banco de dados aqui
    setSelectedBook(book);
    setTitle('');
    setAuthor('');
    setSearchResults([]);
  };

  return (
    <div className="mt-4">
      <h2>Adicionar Livro</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="mb-3">
          <label className="form-label">Autor (opcional)</label>
          <input 
            type="text" 
            className="form-control" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
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
                  <td>{book.authors?.join(', ')}</td>
                  <td>{book.description?.substring(0, 100) || 'Sem descrição'}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleAddBook(book)}
                    >
                      Adicionar ao Acervo
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
          <h4>Livro Adicionado:</h4>
          <p><strong>Título:</strong> {selectedBook.title}</p>
          <p><strong>Autor:</strong> {selectedBook.authors?.join(', ')}</p>
          <p><strong>Descrição:</strong> {selectedBook.description}</p>
          {selectedBook.imageLinks && <img src={selectedBook.imageLinks.thumbnail} alt={selectedBook.title} />}
        </div>
      )}
    </div>
  );
}

export default AddBook;
