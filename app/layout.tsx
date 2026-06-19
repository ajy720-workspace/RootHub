import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

const appleStartupImages = [
  {
    url: '/splash/apple-splash-640x1136.png',
    media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-750x1334.png',
    media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-828x1792.png',
    media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-1125x2436.png',
    media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-1170x2532.png',
    media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-1242x2688.png',
    media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-1284x2778.png',
    media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-1290x2796.png',
    media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-1536x2048.png',
    media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-1668x2224.png',
    media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-1668x2388.png',
    media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  },
  {
    url: '/splash/apple-splash-2048x2732.png',
    media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  }
];

export const metadata: Metadata = {
  applicationName: 'RootHub',
  title: {
    default: 'RootHub',
    template: '%s | RootHub'
  },
  description: '영단어를 접두사, 어근, 접미사와 어원 스토리로 분해해 학습하는 PWA 어휘 앱입니다.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RootHub',
    startupImage: appleStartupImages
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: [{ url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' }]
  }
};

export const viewport: Viewport = {
  themeColor: '#181d26',
  colorScheme: 'light'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          {children}
          <ServiceWorkerRegistration />
        </AuthProvider>
      </body>
    </html>
  );
}
