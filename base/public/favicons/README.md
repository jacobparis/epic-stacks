# Favicons

This directory contains the favicons for the application. The favicons are
generated using [Favicon Generator](https://realfavicongenerator.net/).

## Files

- `android-chrome-192x192.png` - Android Chrome icon (192x192)
- `android-chrome-512x512.png` - Android Chrome icon (512x512)
- `apple-touch-icon.png` - Apple Touch Icon (180x180)
- `favicon-16x16.png` - Favicon (16x16)
- `favicon-32x32.png` - Favicon (32x32)
- `favicon.ico` - Favicon (ICO format)
- `site.webmanifest` - Web App Manifest

This directory has the icons used for android devices. In some cases, we cannot
reliably detect light/dark mode preference. Hence these icons should not have a
transparent background. These icons are referenced in the `site.webmanifest`
file.

The icons used by modern browsers and Apple devices are in `app/assets/favicons`
as they can be imported with a fingerprint to bust the browser cache.

Note, there's also a `favicon.ico` in the root of `/public` which some older
browsers will request automatically. This is a fallback for those browsers.
