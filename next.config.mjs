/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4040', // Adicione a porta usada localmente
                pathname: '**' // Permite todos os caminhos
            },
            {
                protocol: 'https',
                hostname: new URL(process.env.NEXT_PUBLIC_BASEURL).hostname,
                pathname: '/images/**'
            }
        ]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    reactStrictMode: true,
};

export default nextConfig;
