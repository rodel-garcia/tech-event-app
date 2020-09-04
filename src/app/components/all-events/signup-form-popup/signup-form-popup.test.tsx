import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import SignupFormField from './signup-form-popup';
import { TechEvent } from '../../../app.types';

let container: HTMLDivElement | null = null;

const onCloseFnMock = jest.fn().mockReturnValue('popup close!');

const EVENT_MOCK = {
  id: 9,
  isFree: false,
  name: 'Refactoring to clean code',
  city: 'Amsterdam',
  startDate: '2019-07-17T12:00:00+00:00',
  endDate: '2019-07-17T14:00:00+00:00',
} as TechEvent;

describe('<SignupFormField />', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      render(
        <SignupFormField techEvent={EVENT_MOCK} onClose={onCloseFnMock} />,
        container
      );
    });
  });

  afterEach(() => {
    unmountComponentAtNode(container as HTMLDivElement);
    (container as HTMLDivElement).remove();
    container = null;
  });
  test('popup should render', () => {
    expect(container?.querySelector('.popup-content')).toBeInTheDocument();
  });

  test('popup title should be the event name', () => {
    const title = container?.querySelector('.popup-content h3')?.innerHTML;
    expect(title).toBe(EVENT_MOCK.name);
  });

  test('popup form fields should display', () => {
    const fn = container?.querySelector('input[name="firstName"]');
    const ln = container?.querySelector('input[name="lastName"]');
    const email = container?.querySelector('input[type="email"]');
    const cn = container?.querySelector('input[type="number"]');

    expect(fn).toBeInTheDocument();
    expect(ln).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(cn).toBeInTheDocument();
  });

  test('Cancel button should display', () => {
    const btn = container?.querySelector('.button-wrapper button:first-child');
    expect(btn?.textContent).toBe('Cancel');
  });
  test('Register button should display', () => {
    const btn = container?.querySelector('.button-wrapper button:last-child');
    expect(btn?.textContent).toBe('Register');
  });
  test('triggering Cancel button will close the popup', () => {
    const btn = container?.querySelector('.button-wrapper button:first-child');
    act(() => {
      btn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onCloseFnMock).toHaveBeenCalled();
  });
});
