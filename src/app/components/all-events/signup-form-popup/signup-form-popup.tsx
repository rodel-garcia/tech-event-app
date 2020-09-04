import React from 'react';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';

import { TechEvent } from '../../../app.types';
import { LOCALSTORAGE_KEY_PREFFIX } from '../../../app.constant';

import style from './signup-form-popup.module.scss';

type SignupFormField = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: number | '';
};

type PopupProps = {
  techEvent: TechEvent;
  onClose: Function;
};
const SignupFormPopup: React.FC<PopupProps> = ({ techEvent, onClose }) => {
  const initialState: SignupFormField = {
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
  };

  const onSubmit = async (
    values: SignupFormField,
    action: FormikHelpers<SignupFormField>
  ) => {
    localStorage.setItem(
      `${LOCALSTORAGE_KEY_PREFFIX}_${techEvent?.id}`,
      JSON.stringify(values)
    );
    action.setSubmitting(false);
    await onClose();
  };

  return (
    <div className={style['signup-form-popup']}>
      <div className={style['popup-content']}>
        <Formik
          initialValues={initialState}
          validationSchema={setValidationSchema()}
          onSubmit={onSubmit}
        >
          <Form>
            <h3>{techEvent?.name}</h3>
            <div className={style['fields-container']}>
              <div className={style['field-wrapper']}>
                <Field
                  autoFocus
                  placeholder='First Name'
                  name='firstName'
                  type='text'
                />
                <span className={style['error-message']}>
                  <ErrorMessage name='firstName' />
                </span>
              </div>
              <div className={style['field-wrapper']}>
                <Field placeholder='Last Name' name='lastName' type='text' />
                <span className={style['error-message']}>
                  <ErrorMessage name='lastName' />
                </span>
              </div>
              <div className={style['field-wrapper']}>
                <Field placeholder='Email Address' name='email' type='email' />
                <span className={style['error-message']}>
                  <ErrorMessage name='email' />
                </span>
              </div>
              <div className={style['field-wrapper']}>
                <Field
                  placeholder='Contact number'
                  name='contactNumber'
                  type='number'
                />
                <span className={style['error-message']}>
                  <ErrorMessage name='contactNumber' />
                </span>
              </div>
            </div>
            <div className={style['button-wrapper']}>
              <button onClick={() => onClose()}>Cancel</button>
              <button type='submit'>Register</button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignupFormPopup;

const setValidationSchema = (): Yup.ObjectSchema<
  SignupFormField | undefined
> => {
  return Yup.object<SignupFormField>({
    firstName: Yup.string()
      .min(3, 'Must at least 3 letters. please provide valid first name.')
      .max(15, 'Must be max of 15 characters only')
      .required('Required *'),
    lastName: Yup.string()
      .min(3, 'Must at least 3 letters. please provide valid last name.')
      .max(20, 'Must be 20 characters or less')
      .required('Required *'),
    email: Yup.string().email('Invalid email address').required('Required *'),
    contactNumber: Yup.number()
      .required('Required *')
      .test(
        'len',
        'Must at least 8 digits',
        (val) => (val as number)?.toString().length >= 8
      ),
  });
};
