import { Suspense } from 'react';
import SignIn from './signInHome';

export default function Page() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
