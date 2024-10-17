
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    serverExternalPackages: ["@meshsdk/core", "@meshsdk/core-cst", "@meshsdk/react"],
    experimental: {
        after: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    webpack: function (config, { isServer }) {
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        };
        if (!isServer) {
            config.output.environment = {
                ...config.output.environment,
                asyncFunction: true,
            };
        }
        return config;
    },
};
export default nextConfig;

