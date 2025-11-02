export default {
  webpack: (config) => {
    return {
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: 300,
      },
    };
  },
  allowedDevOrigins: ["ticketing.dev"],
  //   images: {
  //   domains: ["https://unsplash.com"],
  // },
   images: {
    remotePatterns: [new URL('https://unsplash.com/**')],
  },
};
