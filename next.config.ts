import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: false,
  serverExternalPackages: ["@next/env"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (webpackConfig, { webpack }) => {
    webpackConfig.plugins = webpackConfig.plugins || [];
    webpackConfig.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /\.scss$/,
        path.resolve("empty-module.cjs")
      ),
      new webpack.NormalModuleReplacementPlugin(
        /ui[\\/]dist[\\/]assets[\\/]index\.js$/,
        path.resolve("lib/payload-assets.ts")
      )
    );
    return webpackConfig;
  },
};

export default withPayload(nextConfig);
