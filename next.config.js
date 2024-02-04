const path = require("node:path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
    }
}

module.exports = nextConfig
