// screens/OnboardingScreensWrapper.js
import React, { Suspense, lazy } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

const OnboardingScreens = lazy(() => import('./OnboardingScreen'));

const OnboardingScreen1 = (props) => {
  return (
    <Suspense fallback={<LoadingOverlay visible={true} />}>
      <OnboardingScreens.OnboardingScreen1 {...props} />
    </Suspense>
  );
};

const OnboardingScreen2 = (props) => {
  return (
    <Suspense fallback={<LoadingOverlay visible={true} />}>
      <OnboardingScreens.OnboardingScreen2 {...props} />
    </Suspense>
  );
};

export { OnboardingScreen1, OnboardingScreen2 };
