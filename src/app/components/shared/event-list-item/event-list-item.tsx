import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobeEurope,
  faHourglassHalf,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

import { TechEvent } from '../../../app.types';
import { LOCALSTORAGE_KEY_PREFFIX } from '../../../app.constant';

import FreeTag from '../free-tag/free-tag';

import style from './event-list-item.module.scss';

const EventListItem: React.FC<{
  event: TechEvent;
  onSignup: Function;
  onCancelEvent?: Function | undefined;
}> = ({ event, onSignup, onCancelEvent }) => {
  return (
    <div className={style['event-item']}>
      <FirstBlock
        event={event}
        onSignup={onSignup}
        onCancelEvent={onCancelEvent}
      />
      <SecondBlock event={event} />
    </div>
  );
};

export default EventListItem;

const FirstBlock: React.FC<{
  event: TechEvent;
  onSignup: Function;
  onCancelEvent: Function | undefined;
}> = ({ event, onSignup, onCancelEvent }) => {
  return (
    <div className={style['item-block-1']}>
      <h3 className={style['title']}>
        {event.isFree && <FreeTag />}
        {event.name}
      </h3>
      {!isRegistered(event.id) ? (
        <SignupButton onSignup={onSignup} techEvent={event} />
      ) : onCancelEvent !== undefined ? (
        <CancelButton onCancelEvent={onCancelEvent} techEvent={event} />
      ) : (
        <span className={style['registered']}>Registered</span>
      )}
    </div>
  );
};

const SignupButton: React.FC<{ onSignup: Function; techEvent: TechEvent }> = ({
  onSignup,
  techEvent,
}) => {
  return (
    <button
      className={style['sign-up-btn']}
      onClick={() => onSignup(techEvent)}
    >
      Sign up
    </button>
  );
};

const CancelButton: React.FC<{
  onCancelEvent: Function;
  techEvent: TechEvent;
}> = ({ onCancelEvent, techEvent }) => {
  return (
    <button
      className={style['cancel-event-btn']}
      onClick={() => onCancelEvent(techEvent.id)}
    >
      Cancel
    </button>
  );
};

const SecondBlock: React.FC<{ event: TechEvent }> = ({ event }) => {
  const duration = getEventTotalDuration(event.startDate, event.endDate);
  const timeRange = getEventTimeRange(event.startDate, event.endDate);
  return (
    <div className={style['item-block-2']}>
      <span className={style['city']}>
        <FontAwesomeIcon icon={faGlobeEurope} /> {event.city}
      </span>
      <span className={style['duration']}>
        <FontAwesomeIcon icon={faHourglassHalf} /> {duration}
      </span>
      <span className={style['time-range']}>
        <FontAwesomeIcon icon={faClock} /> {timeRange}
      </span>
    </div>
  );
};

const isRegistered = (eventId: number) => {
  return (
    localStorage.getItem(`${LOCALSTORAGE_KEY_PREFFIX}_${eventId}`) !== null
  );
};

const getEventTotalDuration = (startDate: string, endDate: string): string => {
  const startDateTime = new Date(startDate).getTime();
  const endDateTime = new Date(endDate).getTime();
  const dateDiff = endDateTime - startDateTime;
  const hourDiff = Math.floor((dateDiff % 86400000) / 3600000);
  const timeDiff = Math.floor(((dateDiff % 86400000) % 3600000) / 60000);
  const hourString = hourDiff <= 9 ? `0${hourDiff}` : hourDiff;
  const minuteString = timeDiff <= 9 ? `0${timeDiff}` : timeDiff;

  return `${hourString}:${minuteString}'`;
};

const getEventTimeRange = (startDate: string, endDate: string): string => {
  const startTime = constructHoursAndMinutes(new Date(startDate));
  const endTime = constructHoursAndMinutes(new Date(endDate));
  return `from ${startTime} to ${endTime}`;
};

const constructHoursAndMinutes = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours <= 9 ? `0${hours}` : hours}:${
    minutes <= 9 ? `0${minutes}` : minutes
  }`;
};
