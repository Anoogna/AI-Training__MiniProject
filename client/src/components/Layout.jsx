import { useEffect, useState } from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('logistics-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('logistics-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`app-layout theme-${theme}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">{children}</main>
    </div>
  );
}
