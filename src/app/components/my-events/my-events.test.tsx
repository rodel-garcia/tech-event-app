import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import _ from 'lodash';

import techEventApi from '../../api/tech-event';
import { TechEvent } from '../../app.types';
import { LOCALSTORAGE_KEY_PREFFIX } from '../../app.constant';

import MyEvents from './my-events';

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

describe('<MyEvents />', () => {
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
    test('empty list if no signed up events', async () => {
      jest
        .spyOn(techEventApi, 'get')
        .mockImplementation(() => Promise.resolve(EVENTS_MOCK));
      await act(async () => {
        render(<MyEvents />, container);
      });
      expect(container?.querySelector('span')?.textContent).toEqual(
        `You don't have any signed-up event yet. please choose one.`
      );
    });

    test('failed request shows error message in the screen', async () => {
      jest
        .spyOn(techEventApi, 'get')
        .mockImplementation(() =>
          Promise.reject({ error: { message: 'has a request error' } })
        );
      await act(async () => {
        render(<MyEvents />, container);
      });
      expect(container?.querySelector('.error-message')).toBeInTheDocument();
    });

    test('display list with content if already signed up and empty message if not', async () => {
      jest
        .spyOn(techEventApi, 'get')
        .mockImplementation(() => Promise.resolve(EVENTS_MOCK));
      await act(async () => {
        render(<MyEvents />, container);
      });

      const ids = getEventIdsFromStorage();
      if (ids.length) {
        expect(container?.querySelector('.event-list')).toBeInTheDocument();
      } else {
        expect(container?.querySelector('span')?.textContent).toEqual(
          `You don't have any signed-up event yet. please choose one.`
        );
      }
    });
  });
});

function getEventIdsFromStorage(): number[] {
  const ids: number[] = [];
  _.forEach(_.keys(localStorage), (key) => {
    if (key.includes(`${LOCALSTORAGE_KEY_PREFFIX}_`)) {
      ids.push(+key.split('_')[1]);
    }
  });
  return ids;
}
