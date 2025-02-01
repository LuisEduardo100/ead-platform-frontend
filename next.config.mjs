/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.NEXT_PUBLIC_URL]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    reactStrictMode: true,
};

export default nextConfig;
