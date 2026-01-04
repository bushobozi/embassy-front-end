import type { Config } from "@react-router/dev/config";

export default {
 async prerender(){
    return ["/", "/consular_login"];
 },
  ssr: true,
} satisfies Config;
