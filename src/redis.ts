import Redis from "ioredis";

export const redis = new Redis({
  host: "redis-11040.c100.us-east-1-4.ec2.redns.redis-cloud.com",
  port: 11040, // use TLS port if you choose TLS
  username: "Test agent",
  password: "Nikhil@some10",
  // tls: {}               // uncomment ONLY if you’re using the TLS endpoint
});

redis.on("connect", () => console.log("[redis] connected"));
redis.on("error", (e) => console.error("[redis] error", e));
