import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import _ from 'lodash';

import techEventApi from '../../api/tech-event';
import { TechEvent } from '../../app.types';

import AllEvents from './all-events';

let container: HTMLDivElement | null = null;

const EVENTS_MOCK = [
  {
    id: 9,
    isFree: false,
    name: 'Refactoring to clean code',
    city: 'Amsterdam',
    startDate: '2019-07-17T12:00:00+00:00',
    endDate: '2019-07-17T14:00:00+00:00',
  },
  {
    id: 8,
    isFree: true,
    name: 'Refactoring to clean code',
    city: 'Palma de Mallorca',
    startDate: '2019-09-13T19:00:00+00:00',
    endDate: '2019-09-13T20:00:00+00:00',
  },
] as TechEvent[];

describe('<AllEvents />', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container as HTMLDivElement);
    (container as HTMLDivElement).remove();
    container = null;
  });

  describe('componentDidMount', () => {
    test('failed request shows error message in the screen', async () => {
      jest
        .spyOn(techEventApi, 'get')
        .mockImplementation(() =>
          Promise.reject({ error: { message: 'has a request error' } })
        );
      await act(async () => {
        render(<AllEvents />, container);
      });
      expect(container?.querySelector('.error-message')).toBeInTheDocument();
    });

    test('notification should displayed if theres no available list', async () => {
      jest
        .spyOn(techEventApi, 'get')
        .mockImplementation(() => Promise.resolve({}));
      await act(async () => {
        render(<AllEvents />, container);
      });
      expect(container?.querySelector('.search-filter')).toBeInTheDocument();
      expect(container?.querySelector('.all-events em')?.textContent).toEqual(
        'No result found'
      );
    });

    test('should displayed the list on successful fetching', async () => {
      jest
        .spyOn(techEventApi, 'get')
        .mockImplementation(() =>
          Promise.resolve(Promise.resolve(EVENTS_MOCK))
        );
      await act(async () => {
        render(<AllEvents />, container);
      });
    });
  });
});
