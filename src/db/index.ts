import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as schema from "./schema";

const connectionString = env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/template";

// For serverless/edge environments, prepare: false is recommended
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
export type Database = typeof db;
