import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NftMintButton } from './NftMintButton';
import { useNftMintContext } from '../NftMintProvider';
import { useNftLifecycleContext } from '../NftLifecycleProvider';
import {
  WagmiProvider,
  createConfig,
  http,
  useAccount,
  useChainId,
} from 'wagmi';
import { type Mock, vi, describe, beforeEach, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { mock } from 'wagmi/connectors';
import { useNftContext } from '../NftProvider';

vi.mock('../NftProvider');
vi.mock('../NftMintProvider');
vi.mock('../NftLifecycleProvider');
vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
    useChainId: vi.fn(),
  };
});
vi.mock('../../../internal/components/Spinner', () => ({
  Spinner: () => <div>Spinner</div>,
}));
vi.mock('../../../transaction', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('../../../transaction')>()),
    TransactionLifecycleStatus: vi.fn(),
    TransactionButton: ({ text, disabled }) => (
      <button type="button" disabled={disabled} data-testid="transactionButton">
        {text}
      </button>
    ),
    Transaction: ({ onStatus, children }) => (
      <>
        <div>
          <button
            type="button"
            onClick={() => onStatus({ statusName: 'transactionPending' })}
          >
            TransactionPending
          </button>
          <button
            type="button"
            onClick={() =>
              onStatus({ statusName: 'transactionLegacyExecuted' })
            }
          >
            TransactionLegacyExecuted
          </button>
          <button
            type="button"
            onClick={() => onStatus({ statusName: 'success' })}
          >
            Success
          </button>
          <button
            type="button"
            onClick={() => onStatus({ statusName: 'error' })}
          >
            Error
          </button>
        </div>
        {children}
      </>
    ),
    TransactionSponsor: vi.fn(),
    TransactionStatus: vi.fn(),
    TransactionStatusAction: vi.fn(),
    TransactionStatusLabel: vi.fn(),
  };
});
vi.mock('../../../wallet', () => ({
  ConnectWallet: () => <div>ConnectWallet</div>,
}));

const queryClient = new QueryClient();

const accountConfig = createConfig({
  chains: [base],
  connectors: [
    mock({
      accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

const TestProviders = ({ children }) => {
  return (
    <WagmiProvider config={accountConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

describe('NftMintButton', () => {
  let mockUpdateLifecycleStatus: Mock;
  beforeEach(() => {
    (useNftContext as Mock).mockReturnValue({
      contractAddress: '0x123',
      tokenId: '1',
    });
    (useNftMintContext as Mock).mockReturnValue({
      quantity: 1,
      network: 'testnet',
      isEligibleToMint: true,
      callData: {
        to: '0x123',
        data: '0x456',
        value: '0',
      },
    });
    mockUpdateLifecycleStatus = vi.fn();
    (useNftLifecycleContext as Mock).mockReturnValue({
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });
    (useAccount as Mock).mockReturnValue({ address: '0xabc' });
    (useChainId as Mock).mockReturnValue(1);
  });

  it('should render the mint button with default label', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    expect(getByText('Mint')).toBeInTheDocument();
  });

  it('should render the mint button with custom label', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton label="Custom Mint" />
      </TestProviders>,
    );
    expect(getByText('Custom Mint')).toBeInTheDocument();
  });

  it('should disable the button when mintToken callData is not available', () => {
    (useNftMintContext as Mock).mockReturnValue({
      quantity: 1,
      network: 'testnet',
      isEligibleToMint: true,
    });

    const { getByTestId } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    expect(getByTestId('transactionButton')).toBeDisabled();
  });

  it('should not disable the button when mintToken callData is available', () => {
    const { getByTestId } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    expect(getByTestId('transactionButton')).not.toBeDisabled();
  });

  it('should display a spinner when mintToken callData is not available', () => {
    (useNftMintContext as Mock).mockReturnValue({
      quantity: 1,
      network: 'testnet',
      isEligibleToMint: true,
    });

    const { getByTestId, getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    expect(getByTestId('transactionButton')).toContainElement(
      getByText('Spinner'),
    );
  });

  it('should render error message if mintError is available', () => {
    (useNftMintContext as Mock).mockReturnValue({
      quantity: 1,
      network: 'testnet',
      isEligibleToMint: true,
      callData: {
        to: '0x123',
        data: '0x456',
        value: '0',
      },
      mintError: {
        code: 3,
        message: 'max mints per wallet exceeded',
      },
    });

    const { getByTestId, getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    expect(getByTestId('transactionButton')).toContainElement(
      getByText('max mints per wallet exceeded'),
    );
  });

  it('should call updateLifecycleStatus with transactionPending status when transactionStatus is transactionPending', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );

    getByText('TransactionPending').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionPending',
    });
  });

  it('should call updateLifecycleStatus with transaction status when transactionStatus is transactionLegacyExecuted', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );

    getByText('TransactionLegacyExecuted').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionLegacyExecuted',
    });
  });

  it('should call updateLifecycleStatus with transaction status when transactionStatus is success', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );

    getByText('Success').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'success',
    });
  });

  it('should call updateLifecycleStatus with transaction status when transactionStatus is error', () => {
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );

    getByText('Error').click();

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
    });
  });

  it('should render ConnectWallet when address is not available', () => {
    (useAccount as Mock).mockReturnValue({ address: null });
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    expect(getByText('ConnectWallet')).toBeInTheDocument();
  });

  it('should show mint ended when isEligibleToMint is false', () => {
    (useNftMintContext as Mock).mockReturnValueOnce({
      isEligibleToMint: false,
    });
    const { getByText } = render(
      <TestProviders>
        <NftMintButton />
      </TestProviders>,
    );
    expect(getByText('Mint ended')).toBeInTheDocument();
  });
});