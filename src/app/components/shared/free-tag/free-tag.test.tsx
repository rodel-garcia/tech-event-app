import React from 'react';
import { render } from '@testing-library/react';

import FreeTag from './free-tag';

describe('<FreeTag />', () => {
  test('renders FREE tag element', () => {
    const { getByText } = render(<FreeTag />);
    const FreeText = getByText(/FREE/i);
    expect(FreeText).toBeInTheDocument();
  });
});
