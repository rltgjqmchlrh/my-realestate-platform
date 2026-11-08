import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '부동산 표시광고 자가진단 플랫폼',
  description: '국토교통부 고시 제2024-748호 준수 검증 도구',
}

export default function RootLayout({
  children,
}, {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
