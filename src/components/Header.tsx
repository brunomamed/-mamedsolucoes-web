import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import * as React from 'react';
import { NotificationsPanel } from './NotificationsPanel';
import '../styles/header.css';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when location changes
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">MAMED</span>
          <span className="logo-subtitle">Soluções</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
            Ordens
          </Link>
          <Link to="/stock" className={`nav-link ${isActive('/stock') ? 'active' : ''}`}>
            Estoque
          </Link>
          <Link to="/parts" className={`nav-link ${isActive('/parts') ? 'active' : ''}`}>
            Peças
          </Link>
          <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`}>
            Relatórios
          </Link>
        </nav>

        <div className="header-right">
          <NotificationsPanel />
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>

        <button
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
