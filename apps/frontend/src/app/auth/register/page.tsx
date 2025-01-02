'use client';

import Page from '@frontend/components/Page/Page';
import authService from '@frontend/services/authService';
import toErrorMap from '@frontend/util/form/toErrorMap';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateUserInput,
  registerPayload,
} from '@validation/schema/auth.schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Path, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import styles from './RegisterPage.module.scss';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const handleShowClick = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateUserInput['body']>({
    resolver: zodResolver(z.object(registerPayload)),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<CreateUserInput['body']> = async data => {
    const result = await authService.register(data);

    if (result && 'errors' in result) {
      const formattedErrors = toErrorMap(result.errors);

      if (formattedErrors) {
        formattedErrors.forEach(({ field, message }) => {
          setError(field as Path<CreateUserInput['body']>, { message });
        });
      }
    } else {
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    }
  };

  return (
    <Page>
      <div className={styles.stack}>
        <div className={styles.avatar} />
        <h1 className={styles.heading}>Register</h1>
        <div className={styles.box}>
          {Boolean(Object.keys(errors)?.length) && (
            <div className={styles.alert}>There are errors in the form.</div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.stack}>
              <div className={styles.formControl}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="First name"
                    {...register('firstName')}
                    aria-invalid={Boolean(errors.firstName)}
                    className={styles.input}
                  />
                  <div className={styles.alertInput}>
                    {errors?.firstName?.message}
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Last name"
                    {...register('lastName')}
                    aria-invalid={Boolean(errors.lastName)}
                    className={styles.input}
                  />
                  <div className={styles.alertInput}>
                    {errors?.lastName?.message}
                  </div>
                </div>
              </div>
              <div className={styles.formControl}>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                    aria-invalid={Boolean(errors.email)}
                    className={styles.input}
                  />
                  <div className={styles.alertInput}>
                    {errors?.email?.message}
                  </div>
                </div>
              </div>
              <div className={styles.formControl}>
                <div className={styles.inputGroup}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password')}
                    aria-invalid={Boolean(errors.password)}
                    className={styles.input}
                  />
                  <div className={styles.alertInput}>
                    {errors?.password?.message}
                  </div>
                  <div className={styles.inputRightElement}>
                    <button
                      type="button"
                      onClick={handleShowClick}
                      className={styles.showButton}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !isValid}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.registerLink}>
        Already joined?{' '}
        <a href="/auth/login" className={styles.link}>
          Login
        </a>
      </div>
    </Page>
  );
}
