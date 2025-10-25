import { createQueryKeys } from '@/services/react-query/createQueryKeys';

export const subscriptionKeys = createQueryKeys({
  entity: 'subscription',
});

export * from './plans';
