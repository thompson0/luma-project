import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"

const mongoURL = process.env.MONGO_DB_URL
if (!mongoURL) {
  throw new Error("MONGO_DB_URL is not defined")
}

const baseURL = process.env.BETTER_AUTH_BASE_URL
if (!baseURL) {
  throw new Error("BETTER_AUTH_BASE_URL is not defined")
}

const authSecret = process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET
if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET or AUTH_SECRET is not defined")
}

if (process.env.NODE_ENV === "production" && authSecret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters in production")
}

const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

const trustProxyHeaders = process.env.BETTER_AUTH_TRUST_PROXY_HEADERS === "true"
const isProduction = process.env.NODE_ENV === "production"
const useSecureCookies = isProduction || baseURL.startsWith("https://")

const client = new MongoClient(mongoURL)

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  baseURL,
  basePath: "/api/v1/auth",
  secret: authSecret,
  trustedOrigins,

  rateLimit: {
    enabled: true,
    storage: "database",
    window: 10,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
      "/request-password-reset": { window: 60, max: 3 },
      "/reset-password": { window: 60, max: 3 },
      "/change-password": { window: 60, max: 3 },
      "/change-email": { window: 60, max: 3 }
    }
  },

  emailAndPassword: {
    enabled: true
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
      strategy: "compact"
    }
  },

  account: {
    encryptOAuthTokens: true,
    storeStateStrategy: "cookie"
  },

  advanced: {
    disableCSRFCheck: false,
    useSecureCookies,
    trustedProxyHeaders: trustProxyHeaders,
    cookiePrefix: "luma",
    defaultCookieAttributes: {
      sameSite: "lax",
      path: "/"
    },
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
      disableIpTracking: false,
      ipv6Subnet: 64
    }
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user"
      }
    }
  }
})
