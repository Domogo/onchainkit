import { useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { checkmarkSvg } from '../../internal/svg/checkmarkSvg';
import { background, cn, color, pressable, text } from '../../styles/theme';
import type { TransactionButtonReact } from '../types';
import { isSpinnerDisplayed } from '../utils/isSpinnerDisplayed';
import { useTransactionContext } from './TransactionProvider';

export function TransactionButton({
  className,
  disabled = false,
  text: buttonText = 'Transact',
}: TransactionButtonReact) {
  const {
    address,
    calls,
    contracts,
    errorMessage,
    isLoading,
    onSubmit,
    receipt,
    statusSingle,
    statusBatched,
    transactionHash,
    transactionId,
  } = useTransactionContext();

  const isInProgress =
    statusSingle === 'pending' || statusBatched === 'pending' || isLoading;
  const isMissingProps = (!calls && !contracts) || !address;
  const isWaitingForReceipt = !!transactionId || !!transactionHash;

  const isDisabled =
    !receipt &&
    (isInProgress || isMissingProps || isWaitingForReceipt || disabled);

  const displaySpinner = isSpinnerDisplayed({
    errorMessage,
    hasReceipt: !!receipt,
    isLoading,
    statusSingle,
    statusBatched,
    transactionHash,
    transactionId,
  });

  const buttonContent = useMemo(() => {
    if (receipt) {
      return checkmarkSvg;
    }
    if (errorMessage) {
      return 'Try again';
    }
    return buttonText;
  }, [buttonText, errorMessage, receipt]);

  return (
    <button
      className={cn(
        background.primary,
        'w-full rounded-xl',
        'mt-4 px-4 py-3 font-medium text-base text-white leading-6',
        isDisabled && pressable.disabled,
        text.headline,
        className,
      )}
      onClick={onSubmit}
      type="button"
      disabled={isDisabled}
    >
      {displaySpinner ? (
        <Spinner />
      ) : (
        <span
          className={cn(text.headline, color.inverse, 'flex justify-center')}
        >
          {buttonContent}
        </span>
      )}
    </button>
  );
}
