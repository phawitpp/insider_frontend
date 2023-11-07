const nextConfig = {
  env: {
    API_URL: process.env.SERVER_URL || "192.168.1.40:3001",
  },
  async redirects() {
    return [
      {
        source: "/404",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
