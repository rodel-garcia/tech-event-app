import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import App from './app';

let container: HTMLDivElement | null = null;

describe('<App />', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      render(<App />, container);
    });
  });

  afterEach(() => {
    unmountComponentAtNode(container as HTMLDivElement);
    container?.remove();
    container = null;
  });

  test('renders the main', () => {
    const main = container?.querySelector('main');
    expect(main).toBeInTheDocument();
  });
  test('renders the header', () => {
    const header = container?.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  test('renders the app logo', () => {
    const logo = container?.querySelector('header img');
    expect(logo).toBeInTheDocument();
  });
  test('renders the navigation', () => {
    const nav = container?.querySelector('header nav');
    expect(nav).toBeInTheDocument();
  });
  test('renders the search-filter', () => {
    const nav = container?.querySelector('aside');
    expect(nav).toBeInTheDocument();
  });
});
