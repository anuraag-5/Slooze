import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    apiToken: string;
    backendExpires: number;
    role: "ADMIN" | "MANAGER" | "MEMBER";
    country: string;
  }

  interface Session {
    user: {
      id: string;
      apiToken: string;
      backendExpires: number;
      role: "ADMIN" | "MANAGER" | "MEMBER";
      country: string
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    apiToken: string;
    backendExpires: number;
    role: "ADMIN" | "MANAGER" | "MEMBER";
    country: string;
  }
}