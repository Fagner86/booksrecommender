// src/components/BookSuggestions.js
import React, { useEffect, useState } from 'react';

function BookSuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Simulação de dados
    setSuggestions([
      { title: 'Livro A', author: 'Autor A' },
      { title: 'Livro B', author: 'Autor B' }
    ]);
  }, []);

  return (
    <div className="mt-4">
      <h2>Sugestões de Lívros para Ler Com base nos Seus livros lidos</h2>
      <ul className="list-group">
        {suggestions.map((book, index) => (
          <li key={index} className="list-group-item">
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookSuggestions;
