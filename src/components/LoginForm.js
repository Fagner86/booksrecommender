import React from 'react';
import { signInWithGoogle } from '../config/auth/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

const LoginForm = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    signInWithGoogle();
    onLogin(); // Chamada quando o login for bem-sucedido
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center p-4 bg-light border rounded">
            <FontAwesomeIcon icon={faBook} style={{ fontSize: '100px', marginBottom: '20px' }} />
            <h2>Login</h2>
            <p>Por favor, faça login para acessar o Book Recommender.</p>
            <button className="btn btn-primary mb-3" onClick={handleGoogleLogin}>
             Entrar com Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
