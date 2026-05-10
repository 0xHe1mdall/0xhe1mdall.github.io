/**
 * Entry point. Imports styles + fonts, mounts the app.
 *
 * Fonts are bundled via @fontsource (self-hosted WOFF2). This avoids the
 * Google Fonts roundtrip and gives us only the weights we actually use.
 */

// Only the weights actually rendered in the UI:
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';

import './styles/index.css';
import { bootstrap } from './app';
import { qs } from './lib/dom';

bootstrap(qs<HTMLElement>('#app'));
