//
import type { Metadata } from "next";
import { AntdRegistry,  } from '@ant-design/nextjs-registry';
import {ConfigProvider, theme, App, } from 'antd';
import "./globals.css";

export const metadata: Metadata = {
  title: "Coffee Order System",
  description: "ระบบสั่งกาแฟออนไลน์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <ConfigProvider 
        theme={{ 
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#C67C4E',
            colorBgContainer: '#1a1a1a',
            colorBgElevated: '#262626',
            colorBorder: '#404040',
            colorText: '#ffffff',
            colorTextSecondary: '#a0a0a0',
            borderRadius: 12,
            colorTextPlaceholder: '#8c8c8c',
            controlItemBgHover: '#c67c4e42',
            controlItemBgActive: '#c67c4e94',
            colorWarningBorderHover: '#1a1a1a',
            controlOutline: 'null',
          }
        }}>
          
            <AntdRegistry><App>
              {children}
            </App></AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}