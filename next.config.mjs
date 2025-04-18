let userConfig;

/**
 * Dynamically import the user configuration file.
 * First tries ESM (`v0-user-next.config.mjs`), then falls back to CJS (`v0-user-next.config`).
 */
try {
  // Try to import ESM configuration
  userConfig = await import('./v0-user-next.config.mjs');
} catch (e) {
  try {
    // Fallback to CJS configuration
    userConfig = await import('./v0-user-next.config');
  } catch {
    // Ignore error if both imports fail
    userConfig = undefined;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint check during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript error blocking
  },
  images: {
    unoptimized: true, // Disable Next.js image optimization
  },
  experimental: {
    webpackBuildWorker: true, // Enable Webpack build worker
    parallelServerBuildTraces: true, // Enable parallel tracing in server builds
    parallelServerCompiles: true, // Enable parallel server compiles
  },
};

// Merge user configuration if it exists
if (userConfig) {
  // Check if the configuration is an ESM default export or a CJS module
  const config = userConfig.default || userConfig;

  // Deep merge the user configuration into the default configuration
  for (const key in config) {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default nextConfig;
