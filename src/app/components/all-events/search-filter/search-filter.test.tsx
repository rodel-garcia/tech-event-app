import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import SearchFilter from './search-filter';
import { FilterValues } from '../../../app.types';

let container: HTMLDivElement | null = null;
let filterValuesMock = {} as FilterValues;
const onFilterFnMock = jest.fn().mockReturnValue('filter is triggered');

describe('<SearchFilter />', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      render(
        <SearchFilter onFilter={onFilterFnMock} values={filterValuesMock} />,
        container
      );
    });
  });

  afterEach(() => {
    unmountComponentAtNode(container as HTMLDivElement);
    container?.remove();
    container = null;
  });

  test('renders the search-filter fields', () => {
    const fields = container?.querySelector('.search-filter');
    expect(fields?.childElementCount).toEqual(7);
  });

  test('renders the search-filter fields', () => {
    const fields = container?.querySelector('.search-filter');
    expect(fields?.childElementCount).toEqual(7);
  });
});
