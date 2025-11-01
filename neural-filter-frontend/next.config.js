const path = require("node:path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8000",
                pathname: "/network_anomalies/get_metric_image/**"
            }
        ]
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
    }
};

module.exports = nextConfig;
