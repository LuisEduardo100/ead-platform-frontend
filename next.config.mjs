/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.NEXT_PUBLIC_BASEURL]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    reactStrictMode: true,
};

export default nextConfig;
