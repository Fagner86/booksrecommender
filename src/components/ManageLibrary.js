import React, { useState } from 'react';
import axios from 'axios';

function ManageLibrary() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [googleBooksData, setGoogleBooksData] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    const booksData = await fetchGoogleBooksData(title);
    setGoogleBooksData(booksData);
    setSelectedBook(null);

  };


  const handleAddBookToLibrary = async (book) => {
    console.log('Adding book to library:', book);
    const { title, authors, description, imageLinks, categories } = book;
    const newBook = {
      title,
      author: authors ? authors.join(', ') : 'Desconhecido',
      description: description || 'Sem descrição',
      image: imageLinks ? imageLinks.thumbnail : 'Sem imagem',
      genre: categories ? categories.join(', ') : 'Desconhecido'
    };
    try {
      // Faz a requisição POST para adicionar o livro ao acervo
      const response = await axios.post('https://books-server-6x8r.onrender.com/books', book);
      console.log('Livro adicionado com sucesso:', response.data);
      setSelectedBook(newBook);
      setGoogleBooksData([]);

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
                <th></th>
                <th>Título</th>
                <th>Autor</th>
                <th>Gênero</th>
                <th>Descrição</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {googleBooksData.map((book, index) => (
                <tr key={index}>
                  <td><img src={book.imageLinks?.thumbnail} alt={book.title} className="card-img-top img-fluid" /></td>
                  <td>{book.title}</td>
                  <td>{book.authors?.join(', ') || 'Desconhecido'}</td>
                  <td>{book.categories ? book.categories.join(', ') : 'Desconhecido'}</td>
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
      {selectedBook && (
        <div className="mt-4">
          <h4>Livro Adicionado ao Acervo:</h4>
          <p><strong>Título:</strong> {selectedBook.title}</p>
          <p><strong>Autor:</strong> {selectedBook.author}</p>
          <p><strong>Descrição:</strong> {selectedBook.description}</p>
          <p><strong>Gênero:</strong> {selectedBook.genre}</p>
          <p><strong>Imagem:</strong></p>
          {selectedBook.image !== 'Sem imagem' && <img src={selectedBook.image} alt={selectedBook.title} />}
        </div>
      )}
    </div>
  );
}

export default ManageLibrary;
