import React from 'react';
import _ from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';

import { TechEvent } from '../../../app.types';
import { DATE } from '../../../app.constant';

import EventListItem from '../event-list-item/event-list-item';
import SignupFormPopup from '../../all-events/signup-form-popup/signup-form-popup';

import style from './event-list.module.scss';

const EventList: React.FC<{
  events: TechEvent[];
  isShowMoreVisible?: boolean;
  onLoadMore?: Function;
  onCancelEvent?: Function | undefined;
}> = ({ events, isShowMoreVisible, onLoadMore = () => {}, onCancelEvent }) => {
  const chunkedEvents = getChunkedEvents(events);
  const [state, setState] = React.useState<{
    isPopupVisible: boolean;
    techEvent: TechEvent | null;
  }>({
    isPopupVisible: false,
    techEvent: null,
  });

  const onSignup = (techEvent: TechEvent) =>
    setState({ ...state, techEvent, isPopupVisible: !state.isPopupVisible });

  const renderPopup = () => {
    return (
      state.isPopupVisible && (
        <SignupFormPopup
          techEvent={state.techEvent as TechEvent}
          onClose={() =>
            setState({ ...state, isPopupVisible: !state.isPopupVisible })
          }
        />
      )
    );
  };

  const renderListEnd = () => {
    return (
      isShowMoreVisible && (
        <div className={style['chunk-list-end']}>
          <button
            onClick={() => onLoadMore()}
            className={style['loadmore-btn']}
          >
            <FontAwesomeIcon icon={faAngleDoubleDown} size='3x' />
          </button>
        </div>
      )
    );
  };

  const renderEventsList = (events: TechEvent[]) => {
    return _.map(events, (event) => (
      <EventListItem
        key={event.id}
        event={event}
        onSignup={() => onSignup(event)}
        onCancelEvent={onCancelEvent}
      />
    ));
  };

  const renderChunkEvents = () => {
    return _.map(chunkedEvents, (events, i) => {
      const chunkDate = getChunkDateString(new Date(events[0].startDate));
      return (
        <div key={i} className={style['chunk-list']}>
          <span className={style['chunk-item-header']}>{chunkDate}</span>
          {renderEventsList(events)}
        </div>
      );
    });
  };

  return (
    <>
      {renderPopup()}
      <div className={style['events-chunk']}>
        {renderChunkEvents()}
        {renderListEnd()}
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
