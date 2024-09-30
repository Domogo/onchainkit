import { cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import type { LifecycleStatus } from '../types';
import { PayProvider } from './PayProvider';

type PayProps = {
  chargeHandler: () => Promise<string>;
  children: React.ReactNode;
  className?: string;
  onStatus?: (status: LifecycleStatus) => void;
};

export function Pay({
  chargeHandler,
  children,
  className,
  onStatus,
}: PayProps) {
  const isMounted = useIsMounted();
  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <PayProvider
      chargeHandler={chargeHandler}
      className={className}
      onStatus={onStatus}
    >
      <div className={cn(className, 'flex w-full flex-col gap-2')}>
        {children}
      </div>
    </PayProvider>
  );
}