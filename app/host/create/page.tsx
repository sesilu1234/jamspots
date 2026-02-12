import { Suspense } from 'react';
import Home from './createPage';

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
