/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile antd for App Router
  transpilePackages: ['antd', '@ant-design/icons'],
}

module.exports = nextConfig