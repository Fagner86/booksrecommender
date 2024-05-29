import React, { useState } from 'react';
import axios from 'axios';

function ManageLibrary() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [googleBooksData, setGoogleBooksData] = useState([]);
  const [file, setFile] = useState(null);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    const booksData = await fetchGoogleBooksData(title);
    setGoogleBooksData(booksData);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const manualBook = { title, authors: [author] };
    setGoogleBooksData([manualBook, ...googleBooksData]);
    setTitle('');
    setAuthor('');
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (file) {
      console.log('Uploading file:', file);
      // Process the file here and save the data to the database
      setFile(null);
    }
  };

  const handleAddBookToLibrary = async (book) => {
    console.log('Adding book to library:', book);
    const booksServerUrl = process.env.BOOKS_SERVER_URL;

      try {
        // Faz a requisição POST para adicionar o livro ao acervo
        const response = await axios.post(`${booksServerUrl}/books`, book);
        console.log('Livro adicionado com sucesso:', response.data);
      } catch (error) {
        console.error('Erro ao adicionar livro ao acervo:', error);
      }
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

  return (
    <div className="mt-4">
      <h2>Gerenciar Biblioteca</h2>
      
      <div className="mb-4">
        <h3>Adicionar Livro via Google Books</h3>
        <form onSubmit={handleSingleSubmit}>
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

      </div>
 {googleBooksData.length > 0 && (
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
              {googleBooksData.map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.authors?.join(', ') || 'Desconhecido'}</td>
                  <td>{book.description?.substring(0, 100) || 'Sem descrição'}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleAddBookToLibrary(book)}
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
      <div className="mb-4">
        <h3>Adicionar Livro Manualmente</h3>
        <form onSubmit={handleManualSubmit}>
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
          <button type="submit" className="btn btn-primary">Adicionar</button>
        </form>
      </div>

      <div className="mb-4">
        <h3>Upload de Arquivo para Cadastro em Massa</h3>
        <form onSubmit={handleFileSubmit}>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              onChange={handleFileUpload}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Upload</button>
        </form>
      </div>

    </div>
  );
}

export default ManageLibrary;
