import React from 'react';

import { TechEvent } from '../../../app.types';
import { LOCALSTORAGE_KEY_PREFFIX } from '../../../app.constant';

import FreeTag from '../free-tag/free-tag';

import style from './event-list-item.module.scss';

const EventListItem: React.FC<{
  event: TechEvent;
  onSignup: Function;
  onCancelEvent?: Function | undefined;
}> = ({ event, onSignup, onCancelEvent }) => {
  const duration = getEventTotalDuration(event.startDate, event.endDate);
  const timeRange = getEventTimeRange(event.startDate, event.endDate);
  return (
    <div className={style['event-item']}>
      <div className={style['item-block-1']}>
        <h3 className={style['title']}>
          {event.isFree && <FreeTag />}
          {event.name}
        </h3>
        {!isRegistered(event.id) ? (
          <button
            className={style['sign-up-btn']}
            onClick={() => onSignup(event)}
          >
            Sign up
          </button>
        ) : onCancelEvent !== undefined ? (
          <button
            className={style['cancel-event-btn']}
            onClick={() => onCancelEvent(event.id)}
          >
            Cancel
          </button>
        ) : (
          <span className={style['registered']}>Registered</span>
        )}
      </div>
      <div className={style['item-block-2']}>
        <span className={style['city']}>{event.city}</span>
        <span className={style['duration']}>{duration}</span>
        <span className={style['time-range']}>{timeRange}</span>
      </div>
    </div>
  );
};

export default EventListItem;

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
