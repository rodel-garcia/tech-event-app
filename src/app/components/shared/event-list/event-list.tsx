import React from 'react';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import { TechEvent } from '../../../app.types';
import { DATE } from '../../../app.constant';

import EventListItem from '../event-list-item/event-list-item';
import RegistrationPopup from '../../all-events/registration-popup/registration-popup';
import style from './event-list.module.scss';

const EventList: React.FC<{
  events: TechEvent[];
  isShowMoreVisible?: boolean;
  onLoadMore?: Function;
  onCancelEvent?: Function | undefined;
}> = ({ events, isShowMoreVisible, onLoadMore = () => {}, onCancelEvent }) => {
  const chunkedEvents = getChunkedEvents(events);
  const [popup, togglePopup] = React.useState<boolean>(false);
  const [techEvent, setTechEvent] = React.useState<TechEvent | null>(null);

  return (
    <>
      {popup && (
        <RegistrationPopup
          techEvent={techEvent as TechEvent}
          onClose={() => togglePopup(!popup)}
        />
      )}
      <div className={style['events-chunk']}>
        {chunkedEvents.map((events, i) => {
          const chunkDate = getChunkDateString(new Date(events[0].startDate));
          return (
            <div key={i} className={style['chunk-list']}>
              <span className={style['chunk-item-header']}>{chunkDate}</span>
              {events.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  onSignup={(event: TechEvent) => {
                    setTechEvent(event);
                    togglePopup(!popup);
                  }}
                  onCancelEvent={onCancelEvent}
                />
              ))}
            </div>
          );
        })}
        {isShowMoreVisible && (
          <div className={style['chunk-list-end']}>
            <button
              onClick={() => onLoadMore()}
              className={style['loadmore-btn']}
            >
              <FontAwesomeIcon icon={faAngleDoubleDown} size='3x' />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EventList;

const getChunkedEvents = (events: TechEvent[]): TechEvent[][] => {
  const marks: string[] = [];
  const result: TechEvent[][] = [];
  _.forEach(events, (event) => {
    const strDate: string = new Date(event.startDate).toDateString();
    if (!marks[strDate]) {
      marks[strDate] = true;
    }
  });
  _.forEach(_.keys(marks), (mark) => {
    const dateChunk = events.filter(
      (event) => new Date(event.startDate).toDateString() === mark
    );
    result.push(dateChunk);
  });
  return result;
};

const getChunkDateString = (date: Date): string => {
  const day = DATE.DAYS[date.getDay()];
  const month = DATE.MONTHS[date.getMonth()];
  const ordinalDate = getOrdinaDate(date.getDate());
  return `${day} ${ordinalDate} ${month}`;
};

const getOrdinaDate = (day: number): string => {
  var j = day % 10,
    k = day % 100;
  if (j === 1 && k !== 11) {
    return day + 'st';
  }
  if (j === 2 && k !== 12) {
    return day + 'nd';
  }
  if (j === 3 && k !== 13) {
    return day + 'rd';
  }
  return day + 'th';
};
