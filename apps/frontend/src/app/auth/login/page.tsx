'use client';

import Page from '@frontend/components/Page/Page';
import { useAuthContext } from '@frontend/context/AuthContext';
import toErrorMap from '@frontend/util/form/toErrorMap';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginPayload, LoginUserInput } from '@validation/schema/auth.schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Path, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuthContext();

  const router = useRouter();

  const handleShowClick = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginUserInput['body']>({
    resolver: zodResolver(z.object({ ...loginPayload })),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginUserInput['body']> = async data => {
    const result = await login(data);

    if (result && 'errors' in result) {
      const formattedErrors = toErrorMap(result.errors);

      if (formattedErrors) {
        formattedErrors.forEach(({ field, message }) => {
          setError(field as Path<LoginUserInput['body']>, { message });
        });
      }
    } else {
      setTimeout(() => {
        router.push('/pets');
      }, 3000);
    }
  };

  return (
    <Page>
      <div className={styles.stack}>
        <div className={styles.avatar} />
        <h1 className={styles.heading}>Login</h1>
        <div className={styles.box}>
          {Boolean(Object.keys(errors)?.length) && (
            <div className={styles.alert}>There are errors in the form.</div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.stack}>
              <div className={styles.formControl}>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    placeholder="email address"
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
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.registerLink}>
        New to us?{' '}
        <a href="/auth/register" className={styles.link}>
          Register
        </a>
      </div>
    </Page>
  );
}
