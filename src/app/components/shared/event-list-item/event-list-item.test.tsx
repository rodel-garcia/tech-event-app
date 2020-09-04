import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import EventListItem from './event-list-item';
import { LOCALSTORAGE_KEY_PREFFIX } from '../../../app.constant';
import { TechEvent } from '../../../app.types';

let container: HTMLDivElement | null = null;
const onSignupFnMock = jest.fn().mockReturnValue('signup test value');

const EVENT_MOCK = {
  id: 9,
  isFree: false,
  name: 'Refactoring to clean code',
  city: 'Amsterdam',
  startDate: '2019-07-17T12:00:00+00:00',
  endDate: '2019-07-17T14:00:00+00:00',
} as TechEvent;

describe('<EventListItem />', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      render(
        <EventListItem event={EVENT_MOCK} onSignup={onSignupFnMock} />,
        container
      );
    });
  });

  afterEach(() => {
    unmountComponentAtNode(container as HTMLDivElement);
    (container as HTMLDivElement).remove();
    container = null;
  });

  test('renders the event list items', () => {
    expect(container?.querySelector('.title')).toBeInTheDocument();
  });

  test('triggers the sign up button', () => {
    const btn = container?.querySelector('.sign-up-btn');
    act(() => {
      btn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onSignupFnMock).toHaveBeenCalled();
  });

  describe('First row', () => {
    test('the event name is set as title', () => {
      expect(container?.querySelector('.title')?.textContent).toEqual(
        EVENT_MOCK.name
      );
    });

    test('check the action button visibility', () => {
      const isRegistered =
        localStorage.getItem(`${LOCALSTORAGE_KEY_PREFFIX}_${EVENT_MOCK.id}`) !==
        null;
      if (isRegistered) {
        expect(container?.querySelector('.registered')).toBeInTheDocument();
      } else {
        expect(container?.querySelector('.sign-up-btn')).toBeInTheDocument();
      }
    });
  });
  describe('Second row', () => {
    test('the event city is displayed', () => {
      expect(container?.querySelector('.city')?.textContent).toContain(
        EVENT_MOCK.city
      );
    });
    test('the event duration is displayed', () => {
      expect(container?.querySelector('.duration')?.textContent).toContain(
        '02:00'
      );
    });
    test('the event time range is displayed', () => {
      expect(container?.querySelector('.time-range')?.textContent).toContain(
        'from 20:00 to 22:00'
      );
    });
  });
});
