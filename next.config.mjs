/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost']
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    reactStrictMode: true,
};

export default nextConfig;
