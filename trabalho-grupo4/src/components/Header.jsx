import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/header.css';

function Header() {
  const navigate = useNavigate();
  const { estaAutenticado, logout } = useAuth();

  function sair() {
    logout();
    navigate('/login');
  }

  return (
    <header className="site-header">
      <nav className="site-nav">
        <ul className="site-nav-list">
       

              <li>
                <Link className="site-nav-link" to="/home">
                  Home
                </Link>
              </li>
              <li>
                <Link className="site-nav-link" to="/avistamento">
                  Avistamento
                </Link>
              </li>

              <li>
                <Link className="site-nav-link" to="/aliens">
                  Aliens
                </Link>
              </li>

              <li>
                <Link className="site-nav-link" to="/planetas">
                  Planetas
                </Link>
              </li>


          {estaAutenticado && (
            <>


              <li>
                <button
                  className="site-nav-link logout-button"
                  type="button"
                  onClick={sair}
                >
                  Sair
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;