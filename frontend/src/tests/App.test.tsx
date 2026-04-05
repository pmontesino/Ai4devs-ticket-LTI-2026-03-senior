import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders candidate form title', () => {
  render(<App />);
  expect(screen.getByText(/anadir candidato/i)).toBeInTheDocument();
});
