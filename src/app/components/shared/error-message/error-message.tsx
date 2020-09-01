import React from 'react';
import { AxiosError } from 'axios';

const ErrorMessage: React.FC<{ error: AxiosError }> = ({ error }) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
  return (
    <div className='error-message'>
      <em style={{ color: 'red' }}>{error.message}</em>
    </div>
  );
};

export default ErrorMessage;
