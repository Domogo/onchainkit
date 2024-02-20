import type { Sidebar } from 'vocs';

export const sidebar = [
  {
    text: 'Introduction',
    items: [{ text: 'Getting Started', link: '/getting-started' }],
  },
  {
    text: 'Farcaster Kit',
    items: [
      {
        text: 'Introduction',
        link: '/farcasterkit/introduction',
      },
      {
        text: 'Utilities',
        items: [
          {
            text: 'getFarcasterUserAddress',
            link: '/farcasterkit/get-farcaster-user-address',
          },
        ],
      },
      {
        text: 'Types',
        link: '/farcasterkit/types',
      },
    ],
  },
  {
    text: 'Frame Kit',
    items: [
      { text: 'Introduction', link: '/framekit/introduction' },
      {
        text: 'Components',
        items: [
          {
            text: 'FrameMetadata',
            link: '/framekit/frame-metadata',
          },
        ],
      },
      {
        text: 'Utilities',
        items: [
          {
            text: 'getFrameHtmlResponse',
            link: '/framekit/get-frame-html-response',
          },
          {
            text: 'getFrameMessage',
            link: '/framekit/get-frame-message',
          },
          {
            text: 'getFrameMetadata',
            link: '/framekit/get-frame-metadata',
          },
        ],
      },
      {
        text: 'Types',
        link: '/framekit/types',
      },
      {
        text: 'Emulator',
        link: '/framekit/framegear',
      },
    ],
  },
  {
    text: 'Identity Kit',
    items: [
      { text: 'Introduction', link: '/identitykit/introduction' },
      {
        text: 'Components',
        items: [
          {
            text: 'Avatar',
            link: '/identitykit/avatar',
          },
          {
            text: 'Name',
            link: '/identitykit/name',
          },
        ],
      },
      {
        text: 'Types',
        link: '/identitykit/types',
      },
    ],
  },
] as const satisfies Sidebar;