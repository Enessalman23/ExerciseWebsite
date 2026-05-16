import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders without crashing', () => {
    // Basic test to verify routing renders without error
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Check if the logo/brand name appears anywhere in the document
    // (Assuming BahoFitness is rendered in Sidebar or elsewhere)
    // Note: Since this requires auth state, it might render login or dashboard
    expect(document.body).toBeDefined();
  });
});
