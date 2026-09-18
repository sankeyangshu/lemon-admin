import { useRouterState } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import type { LoadingBarRef } from 'react-top-loading-bar';
import LoadingBar from 'react-top-loading-bar';

const NavigationProgress = () => {
  const state = useRouterState();
  const progressRef = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (state.status === 'pending') {
      progressRef.current?.continuousStart();
    } else {
      progressRef.current?.complete();
    }
  }, [state.status]);

  return <LoadingBar color="var(--color-primary)" ref={progressRef} shadow={true} height={2} />;
};

export default NavigationProgress;
