import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Hospital IT Helpdesk Portal login page', () => {
  render(<App />);
  expect(screen.getByText(/Hospital IT Helpdesk/i)).toBeInTheDocument();
});
