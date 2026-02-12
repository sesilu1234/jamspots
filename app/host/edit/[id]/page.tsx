import { Suspense } from 'react';
import Home from './editPage';

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
