import type React from 'react';
import { useEffect, useState } from 'react';
import CopyIcon from '../svg/CopySvg.js';
import CheckIcon from '../svg/checkSvg.js';

// Demo components and code snippets
import CheckoutDemo, { checkoutDemoCode } from './CheckoutDemo.tsx';
import FundDemo, { fundDemoCode } from './FundDemo.tsx';
import IdentityDemo, { identityDemoCode } from './IdentityDemo.tsx';
import SwapDemo, { swapDemoCode } from './SwapDemo.tsx';
import TransactionDemo, { transactionDemoCode } from './TransactionDemo.tsx';
import WalletDemo, { walletDemoCode } from './WalletDemo.tsx';

type Component = {
  name: string;
  component: React.ComponentType;
  code: string;
  description: string;
};

const components: Component[] = [
  {
    name: 'Wallet',
    component: WalletDemo,
    code: walletDemoCode,
    description: 'Enable users to onboard and log into your app with a wallet.',
  },
  {
    name: 'Swap',
    component: SwapDemo,
    code: swapDemoCode,
    description: 'Enable swaps between different cryptocurrencies.',
  },
  {
    name: 'Checkout',
    component: CheckoutDemo,
    code: checkoutDemoCode,
    description:
      'Accept USDC payments with instant user onboarding and onramps.',
  },
  {
    name: 'Transaction',
    component: TransactionDemo,
    code: transactionDemoCode,
    description: 'Trigger onchain transactions and sponsor them with Paymaster',
  },
  {
    name: 'Fund',
    component: FundDemo,
    code: fundDemoCode,
    description: 'Fund wallets with a debit card or a coinbase account.',
  },
  {
    name: 'Identity',
    component: IdentityDemo,
    code: identityDemoCode,
    description:
      'Display the Basename, avatar, and address associated with a wallet.',
  },
];

function ComponentPreview() {
  const [isClient, setIsClient] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'code'>(
    'preview',
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 600);
    });
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
        <ComponentList
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          components={components}
        />
        <PreviewContainer
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          copiedIndex={copiedIndex}
          copyToClipboard={copyToClipboard}
        />
      </div>
    </div>
  );
}

interface ComponentListProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
  components: Component[];
}

function ComponentList({
  activeTab,
  setActiveTab,
  components,
}: ComponentListProps) {
  return (
    <div className="w-full md:w-[300px] lg:flex-shrink-0">
      <h3 className="pb-4 font-medium text-3xl text-zinc-900 dark:text-zinc-100">
        Ready-to-use components
      </h3>
      <div className="pb-6 text-lg text-zinc-700 dark:text-zinc-500">
        Accelerate your time-to-market with prebuilt components.
      </div>
      <div className="flex flex-col">
        {components.map((comp, index) => (
          <div key={comp.name} className="mb-4">
            <button
              type="button"
              className={`w-full px-3 py-2 text-left text-base lg:text-lg ${
                activeTab === index
                  ? 'rounded-lg bg-zinc-100 font-semibold text-indigo-600 dark:bg-[#0F0F0F] dark:text-indigo-400'
                  : 'text-zinc-700 hover:rounded-lg hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-[#0F0F0F]'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {comp.name}
              {activeTab === index && (
                <div className="mt-1 font-normal text-sm text-zinc-600 dark:text-zinc-400">
                  {comp.description}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

type PreviewContainerProps = {
  activeTab: number;
  activeSubTab: 'preview' | 'code';
  setActiveSubTab: (subTab: 'preview' | 'code') => void;
  copiedIndex: number | null;
  copyToClipboard: (text: string, index: number) => void;
};

type TabButtonProps = {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function PreviewContainer({
  activeTab,
  activeSubTab,
  setActiveSubTab,
  copiedIndex,
  copyToClipboard,
}: PreviewContainerProps) {
  const ActiveComponent = components[activeTab].component;

  return (
    <div className="h-[550px] w-[375px] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 sm:w-[600px] md:h-[670px] md:w-[700px] dark:border-zinc-900 dark:bg-zinc-950">
      <div className="mt-2 flex items-center justify-between border-zinc-200 border-b px-3 dark:border-zinc-900">
        <div className="flex">
          <TabButton
            isActive={activeSubTab === 'preview'}
            onClick={() => setActiveSubTab('preview')}
          >
            Preview
          </TabButton>
          <TabButton
            isActive={activeSubTab === 'code'}
            onClick={() => setActiveSubTab('code')}
          >
            Code
          </TabButton>
        </div>
        {activeSubTab === 'code' && (
          <button
            type="button"
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            onClick={() =>
              copyToClipboard(components[activeTab].code, activeTab)
            }
            title={copiedIndex === activeTab ? 'Copied!' : 'Copy to clipboard'}
          >
            {copiedIndex === activeTab ? (
              <CheckIcon className="h-5 w-5" />
            ) : (
              <CopyIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      <div className="flex overflow-auto">
        <div
          className={`${
            activeSubTab === 'preview' ? 'flex' : 'hidden'
          } h-[500px] w-full items-center justify-center md:h-[600px]`}
        >
          <ActiveComponent />
        </div>
        <div className={`${activeSubTab === 'code' ? 'flex' : 'hidden'} p-4`}>
          <pre className="h-[450px] whitespace-pre-wrap break-words text-sm md:h-[600px]">
            <code>{components[activeTab].code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function TabButton({ isActive, onClick, children }: TabButtonProps) {
  return (
    <button
      type="button"
      className={`px-4 py-2 font-medium text-sm ${
        isActive
          ? 'border-indigo-600 border-b-2 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default ComponentPreview;
