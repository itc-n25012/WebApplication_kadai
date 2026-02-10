import { createClient } from "microcms-js-sdk";

if (
  !process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN ||
  !process.env.NEXT_PUBLIC_MICROCMS_API_KEY
) {
  throw new Error("microCMS env is missing");
}

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY,
});
