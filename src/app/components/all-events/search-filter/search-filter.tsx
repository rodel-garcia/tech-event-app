import React from 'react';

import { FilterValues, FilterNames } from '../../../app.types';
import FreeTag from '../../shared/free-tag/free-tag';
import style from './search-filter.module.scss';

const SearchFilter: React.FC<{
  onFilter: Function;
  values: FilterValues;
}> = ({ onFilter, values }) => {
  return (
    <aside className={style['search-filter']}>
      {renderTextBox(values.name, FilterNames.NAME, onFilter)}
      {renderTextBox(values.city, FilterNames.CITY, onFilter)}
      <div className={style['only-free']}>
        {renderCheckBox(values.isFree, FilterNames.ONLY_FREE, onFilter)}
      </div>
      {renderCheckBox(values.morning, FilterNames.MORNING, onFilter)}
      {renderCheckBox(values.afternoon, FilterNames.AFTERNOON, onFilter)}
      {renderCheckBox(values.evening, FilterNames.EVENING, onFilter)}
      {renderCheckBox(values.night, FilterNames.NIGHT, onFilter)}
    </aside>
  );
};

export default SearchFilter;

const renderTextBox = (value: string = '', name: string, action: Function) => {
  return <FilterInput name={name} value={value} action={action} />;
};

const renderCheckBox = (
  value: boolean = false,
  name: string,
  action: Function
) => {
  return <FilterCheckBox value={value} name={name} action={action} />;
};

const FilterInput: React.FC<{
  name: string;
  action: Function;
  value: string | null;
}> = ({ name, action, value = null }) => {
  return (
    <input
      type='text'
      placeholder={name}
      name={name}
      value={value || ''}
      onChange={(e) => action(e.target.value, e.target.name)}
    />
  );
};

const FilterCheckBox: React.FC<{
  name: string;
  action: Function;
  value?: boolean;
}> = ({ name, action, value = false }) => {
  return (
    <div className={style['checkbox-wrapper']}>
      <input
        type='checkbox'
        name={name}
        id={name}
        checked={value}
        onChange={(e) => action(e.target.checked, e.target.name)}
      />
      <label htmlFor={name}>
        {name === FilterNames.ONLY_FREE ? (
          <span>
            Only <FreeTag />
          </span>
        ) : (
          name
        )}
      </label>
    </div>
  );
};
