export type CrossOrigin = 'anonymous' | 'use-credentials' | ''

declare module 'next/head' {
  interface HeadProps {
    crossOrigin?: CrossOrigin
  }
} 