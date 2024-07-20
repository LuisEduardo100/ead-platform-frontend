/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    reactStrictMode: true,
    // output: "export"

};

export default nextConfig;
