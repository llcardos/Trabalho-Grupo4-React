import { Link } from 'react-router-dom';
import '../styles/header.css';

function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav">
        <ul className="site-nav-list">
          <li><Link className="site-nav-link" to="/login">Login</Link></li>
          <li><Link className="site-nav-link" to="/avistamento">Avistamento</Link></li>
          <li><Link className="site-nav-link" to="/aliens">Aliens</Link></li>
          <li><Link className="site-nav-link" to="/planetas">Planetas</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;