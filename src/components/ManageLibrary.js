import React, { useState } from 'react';
import axios from 'axios';

function ManageLibrary() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState(null);
  const [googleBooksData, setGoogleBooksData] = useState(null);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    const bookData = await fetchGoogleBooksData(title);
    console.log(`Adding book - Title: ${title}, Author: ${author}`, bookData);
    // Adicione lógica para salvar o livro no banco de dados aqui
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

  const fetchGoogleBooksData = async (title) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`);
      const data = response.data.items[0].volumeInfo;
      setGoogleBooksData(data);
      return data;
    } catch (error) {
      console.error('Error fetching book data:', error);
      return null;
    }
  };

  return (
    <div className="mt-4">
      <h2>Gerenciar Biblioteca</h2>
      <div className="mb-4">
        <h3>Adicionar Livro Individualmente</h3>
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
            <label className="form-label">Autor</label>
            <input
              type="text"
              className="form-control"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Adicionar</button>
        </form>
        {googleBooksData && (
          <div className="mt-4">
            <h4>Dados do Google Books:</h4>
            <p><strong>Título:</strong> {googleBooksData.title}</p>
            <p><strong>Autor:</strong> {googleBooksData.authors.join(', ')}</p>
            <p><strong>Descrição:</strong> {googleBooksData.description}</p>
            <img src={googleBooksData.imageLinks.thumbnail} alt={googleBooksData.title} />
          </div>
        )}
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
