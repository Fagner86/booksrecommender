import React from 'react';
import { signInWithGoogle } from '../config/auth/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import imageLogo from '../assets/image_logo.jpeg'; // Certifique-se de que o caminho está correto

const LoginForm = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    signInWithGoogle();
    onLogin(); // Chamada quando o login for bem-sucedido
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card bg-dark text-dark">
            <img src={imageLogo} className="card-img img-fluid" alt="Background" />
            <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center">
              <div className="mt-auto mb-1 text-center">
                <h1 className="card-title">Login</h1>
                <p className="card-title">Por favor, faça login para acessar.</p>
                <button className="btn btn-primary mt-1" onClick={handleGoogleLogin}>
                  <FontAwesomeIcon icon={faGoogle} /> <span style={{fontSize: 'smaller'}}><b style={{color: 'black'}}>Entrar com Google</b></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
