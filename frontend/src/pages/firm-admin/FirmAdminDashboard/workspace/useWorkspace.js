import { useMemo } from 'react';
import { useFirmWorkspace } from '../../../../queries/useFirms';
import { sampleWorkspace } from './sampleWorkspace';

/** The home widgets' data: the real workspace, or fixed sample numbers in sample mode. */
export const useWorkspace = (sample) => {
  const real = useFirmWorkspace({ enabled: !sample });
  const fake = useMemo(() => (sample ? sampleWorkspace() : null), [sample]);
  return sample ? { data: fake, isError: false, refetch: () => {} } : real;
};
