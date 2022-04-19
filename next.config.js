/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Image component에서 remote Image를 사용하기 위해서는 해당 이미지를 제공하는 서버의 도메인 이름을 추가해야함.
  images: { domains: ["imagedelivery.net", "videodelivery.net"] },
};

module.exports = nextConfig;
