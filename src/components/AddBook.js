// src/components/AddBook.js
import React, { useState } from 'react';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Title: ${title}, Author: ${author}`);
    setTitle('');
    setAuthor('');
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
    </div>
  );
}

export default AddBook;