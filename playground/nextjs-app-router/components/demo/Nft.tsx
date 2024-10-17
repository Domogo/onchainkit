import { useCallback } from 'react';
import {
  NftMint,
  NftView,
  type LifecycleStatus,
  type NftError,
} from '@/onchainkit/esm/nft';
import {
  NftMedia,
  NftTitle,
  NftOwner,
  NftLastSoldPrice,
  NftMintDate,
  NftNetwork,
} from '@/onchainkit/esm/nft/components/view';
import { 
  NftCreator,
  NftMintButton,
  NftMinters,
  NftQuantitySelector,
  NftCost,
  NftTotalCost,
} from '@/onchainkit/esm/nft/components/mint';
import type { TransactionReceipt } from 'viem';

// adidas 0xc6A1F929B7cA5D76e0fA21EB44da1E48765990C5 ERC1155
// autumn 0x473d2D4C09669962c2CbDB1c34ba8f0fc843Fb69
// fall at the florida zoo 0x8443d418e82c3A2A530013218D49E0347BA13fDe ERC1155
// some other base mint 0x96c2E93Aa994D0A467f377c77075B00421EFB046  ERC1155
// bored ape gang 0x381b0d693dc6c5ea556838e8604ae000510a16ac 1
// persona 0x6502820f3f035c7a9fc0ebd3d74a0383306c5137
// mochimons 0x949bed087ff0241e04e98d807de3c3dd97eaa381
// hoomans 0xbe3c7abab76f0a1de602fdb2f44faf604a5f649f
// mr miggles video 0x1f52841279fA4dE8B606a70373E9c84e84Ce9204
// cb quarterly earnings 0x1D6b183bD47F914F9f1d3208EDCF8BefD7F84E63
// audio - 0x05a28e3d5f68c8b4a521ab7f74bd887fae6a598d base song

function NftDemo() {
  const handleOnStatus = useCallback((lifecycleStatus: LifecycleStatus) => {
    console.log('Status:', lifecycleStatus);
  }, []);

  const handleOnSuccess = useCallback(
    (transactionReceipt?: TransactionReceipt) => {
      console.log('Success:', transactionReceipt);
    },
    [],
  );

  const handleOnError = useCallback((nftError: NftError) => {
    console.log('Error:', nftError);
  }, []);

  return (
    <>
      <NftMint
        contractAddress="0x8443d418e82c3A2A530013218D49E0347BA13fDe"
        onStatus={handleOnStatus}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
      >
        <NftCreator />
        <NftMedia />
        <NftTitle />
        <NftMinters />
        <NftQuantitySelector />
        <NftCost />
        <NftMintButton />
        <NftTotalCost />
      </NftMint>

      <div style={{ height: '20px' }} />

      <NftView
        contractAddress="0x8443d418e82c3A2A530013218D49E0347BA13fDe"
        tokenId="2"
        onStatus={handleOnStatus}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
      >
        <NftMedia />
        <NftTitle />
        <NftOwner />
        <NftLastSoldPrice />
        <NftMintDate />
        <NftNetwork />
      </NftView>
    </>
  );
}

export default NftDemo;