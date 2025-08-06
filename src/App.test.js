import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { render } from '@testing-library/react';

test('renders App', () => {
  render(
    <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <App />
    </MemoryRouter>
  );
});
