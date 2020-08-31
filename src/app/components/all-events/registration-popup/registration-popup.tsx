import React from 'react';

import { TechEvent } from '../../../app.types';
import { LOCALSTORAGE_KEY_PREFFIX } from '../../../app.constant';

import style from './registration-popup.module.scss';

type RegistrationForm = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: number | string;
  eventId: number | null;
};

type PopupProps = {
  techEvent: TechEvent;
  onClose: Function;
};

const RegistrationPopup: React.FC<PopupProps> = ({ techEvent, onClose }) => {
  const [state, setstate] = React.useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    eventId: techEvent.id,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setstate({
      ...state,
      [name]: value,
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(
      `${LOCALSTORAGE_KEY_PREFFIX}_${techEvent?.id}`,
      JSON.stringify(state)
    );
    onClose();
  };

  return (
    <div className={style.popup}>
      <div className={style['popup-content']}>
        <form onSubmit={(e) => onSubmit(e)}>
          <span>Signup for:</span>
          <h3>{techEvent?.name}</h3>
          <input
            type='text'
            name='firstName'
            placeholder='First Name'
            value={state.firstName}
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(event)
            }
          />
          <input
            type='text'
            name='lastName'
            placeholder='Last Name'
            value={state.lastName}
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(event)
            }
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={state.email}
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(event)
            }
          />
          <input
            type='number'
            name='contactNumber'
            placeholder='Contact Number'
            value={state.contactNumber}
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(event)
            }
          />
          <div>
            <button onClick={() => onClose()}>Cancel</button>
            <button type='submit'>Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPopup;
