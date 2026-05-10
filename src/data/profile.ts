import type { Profile } from '../types';

/**
 * Personal info. Edit this file to update the page.
 * Email/Discord are placeholders — replace with real ones.
 */
export const PROFILE: Profile = {
  handle: '0xHe1mdall',
  country: '0xFA0000',
  social: [
    {
      label: 'github',
      href: 'https://github.com/0xHe1mdall',
      variant: 'default',
    },
    {
      label: 'discord',
      // Replace with your Discord profile URL or invite.
      href: 'https://discord.com/users/0xHe1mdall',
      variant: 'kw',
    },
    {
      label: 'email',
      // Plain mailto — works on GitHub Pages, no backend required.
      href: 'mailto:heimdall.contact@proton.me',
      variant: 'green',
    },
  ],
};
