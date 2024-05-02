import { Outlet } from 'react-router-dom';
import './styles/Root.css';
import "./styles/base.css";
import { Crown } from './components/crown/Crown';
import { memo } from 'react';

/**
 * Root component that renders Crown (topbar element) and root <Outlet /> for app routes
 * 
 * @returns The app's root component
 */
export const Root = memo(function Root()  {

  return (
    <div id="root-grid" data-testid="root-grid">
      <Crown/>
      <main className="full-space">
      <Outlet />
      </main>
    </div>
  )
});
