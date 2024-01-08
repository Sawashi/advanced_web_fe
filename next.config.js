/** @type {import('next').NextConfig} */

const config = {
  reactStrictMode: false,
  env: {
    API_URL: process.env.API_URL,
    BASE_URL: process.env.BASE_URL,
    HOST: process.env.HOST,
    API_TEMPLATE_URL: process.env.API_TEMPLATE_URL,
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/user/home",
        permanent: true,
      },
      {
        source: "/classes",
        destination: "/user/home",
        permanent: true,
      },
      {
        source: "/user",
        destination: "/user/home",
        permanent: true,
      },
    ];
  },
};

module.exports = config;
