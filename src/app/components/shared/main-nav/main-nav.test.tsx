import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter as Router } from 'react-router-dom';

import MainNav from './main-nav';

describe('<MainNav />', () => {
  const { container } = render(
    <Router>
      <MainNav />
    </Router>
  );
  const nav = container.querySelector('.main-nav');
  test('having two main links', () => {
    expect(nav?.childElementCount).toBe(2);
  });
  test('first link text', () => {
    const text = nav?.querySelector('a:first-child')?.textContent;
    expect(text).toBe('All events');
  });
  test('first link text', () => {
    const text = nav?.querySelector('a:last-child')?.textContent;
    expect(text).toBe('My events');
  });
});
