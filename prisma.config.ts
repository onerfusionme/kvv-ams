// Prisma config for Asset Management System
import "dotenv/config";
import { defineConfig } from "prisma/config";

// Neon PostgreSQL connection string
const DATABASE_URL = "postgresql://neondb_owner:npg_KQT9Gk7cHUId@ep-odd-tree-a43m83k9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
  datasource: {
    url: DATABASE_URL,
  },
});
