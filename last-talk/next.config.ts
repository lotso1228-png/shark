import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // サーバー不要：静的ファイルとして書き出し、どこでもホスティング可能にする
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
