import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      {
        // Login is the entry point of the app for now. Temporary (307) so
        // browsers don't cache it once "/" becomes a real landing page.
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
