import React from 'react';
import { render } from '@testing-library/react';
import App from './app';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Free/i);
  expect(linkElement).toBeInTheDocument();
});
