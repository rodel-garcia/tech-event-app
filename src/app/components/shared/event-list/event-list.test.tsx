import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import EventList from './event-list';
import { TechEvent } from '../../../app.types';

let container: HTMLDivElement | null = null;

const onSignupFnMock = jest.fn().mockReturnValue('signup test value');

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

describe('<EventList />', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      render(<EventList events={EVENTS_MOCK} />, container);
    });
  });

  afterEach(() => {
    unmountComponentAtNode(container as HTMLDivElement);
    (container as HTMLDivElement).remove();
    container = null;
  });

  describe('chunkList', () => {
    test('chunk list displayed based on date', () => {
      const chunk = container?.querySelector('.events-chunk');
      expect(chunk?.childElementCount).toBe(2);
    });
    test('chunk list header should be formatted date', () => {
      const chunkHeader1 = container?.querySelector(
        '.chunk-list:first-child .chunk-item-header'
      );
      const chunkHeader2 = container?.querySelector(
        '.chunk-list:last-child .chunk-item-header'
      );
      expect(chunkHeader1?.textContent).toBe('Wednesday 17th July');
      expect(chunkHeader2?.textContent).toBe('Saturday 14th September');
    });

    describe('events list item', () => {
      test('each chunk renders list of EventListItem', () => {
        const item = container?.querySelector('.event-item');
        expect(item).toBeInTheDocument();
      });
    });
  });
});
