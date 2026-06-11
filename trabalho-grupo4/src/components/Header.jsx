import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/avistamento">Avistamento</Link></li>
          <li><Link to="/aliens">Aliens</Link></li>
          <li><Link to="/planetas">Planetas</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;