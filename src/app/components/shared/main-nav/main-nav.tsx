import React from 'react';
import { NavLink } from 'react-router-dom';

import style from './main-nav.module.scss';

const MainNav: React.FC = () => {
  return (
    <nav className={style['main-nav']}>
      <NavLink activeClassName={style['active']} exact to='/'>
        All events
      </NavLink>
      <NavLink activeClassName={style['active']} exact to='/my-events'>
        My events
      </NavLink>
    </nav>
  );
};

export default MainNav;
