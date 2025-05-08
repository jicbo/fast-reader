import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	webpack: (config, { isServer }) => {
		// Fix for 'fs' module not found error with pdf-parse
		if (!isServer) {
			config.resolve.fallback = {
				fs: false,
				net: false,
				tls: false,
			};
		}
		return config;
	},
};

export default nextConfig;
