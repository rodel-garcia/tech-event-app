import React from 'react';
import { render } from '@testing-library/react';

import Spinner from './spinner';

test('renders FREE tag element', () => {
  const { container } = render(<Spinner />);
  expect(container.querySelector('.lds-ellipsis')?.childElementCount).toBe(4);
});
