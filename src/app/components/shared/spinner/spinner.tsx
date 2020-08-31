import React from 'react';
import style from './spinner.module.scss';

const Spinner: React.FC = () => {
  return (
    <div className={style['lds-ellipsis']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
