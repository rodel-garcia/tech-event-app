import React from 'react';
import { AxiosError } from 'axios';

const ErrorMessage: React.FC<{ error: AxiosError }> = ({ error }) => {
  if (error.response) {
    // Handle response error
    // console.log(error.response.data);
    // console.log(error.response.status);
    // console.log(error.response.headers);
  } else if (error.request) {
    // Handle request error
    // console.log(error.request);
  } else {
    // Handle any error
    // console.log(error.message);
  }
  return (
    <div className='error-message'>
      <em style={{ color: 'red' }}>{error.message}</em>
    </div>
  );
};

export default ErrorMessage;
