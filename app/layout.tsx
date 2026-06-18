import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

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
    title: 'RootHub'
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
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
