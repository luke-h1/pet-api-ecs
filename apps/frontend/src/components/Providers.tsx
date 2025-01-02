'use client';

import { AuthContextProvider } from '@frontend/context/AuthContext';
import composeProviders from '@frontend/hocs/composeProviders';
import {
  QueryClient,
  QueryClientProvider as BaseQueryClientProvider,
  HydrationBoundary,
} from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { MotionConfig as FramerMotionConfig } from 'framer-motion';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider defaultTheme="system">{children}</NextThemeProvider>
  );
}

function MotionConfig({ children }: { children: ReactNode }) {
  return (
    <FramerMotionConfig reducedMotion="user">{children}</FramerMotionConfig>
  );
}

function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // @ts-expect-error - types are wrong in react-query for suspense
            suspense: true,
          },
        },
      }),
  );

  return (
    <BaseQueryClientProvider client={queryClient}>
      <HydrationBoundary queryClient={queryClient}>
        <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      </HydrationBoundary>
    </BaseQueryClientProvider>
  );
}

function AuthContext({ children }: { children: ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}

const ComposedProviders = composeProviders(
  ThemeProvider,
  MotionConfig,
  QueryClientProvider,
  AuthContext,
);

export default function Providers({ children }: Props) {
  return <ComposedProviders>{children}</ComposedProviders>;
}
