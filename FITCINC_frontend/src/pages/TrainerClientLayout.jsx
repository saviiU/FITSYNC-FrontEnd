import { NavLink, Outlet } from 'react-router-dom';
import '../styles/TrainerClient.css';

const tabs = [
  ['/trainers', 'Book'],
  ['/progress', 'Progress'],
  ['/clients', 'Clients'],
];

export default function TrainerClientLayout() {
  return (
    <div className="tc-app">
      <Outlet />
      <nav className="nav">
        {tabs.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'on' : '')}>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}