import React from 'react';
import { render, screen } from '@testing-library/react';

import ErrorMessage from './error-message';
import { AxiosError } from 'axios';

describe('<ErrorMessage />', () => {
  test('render error message', () => {
    const error = { message: 'this is a test error message' } as AxiosError;
    const { container } = render(<ErrorMessage error={error} />);
    expect(container.textContent).toBe(error.message);
  });
});
