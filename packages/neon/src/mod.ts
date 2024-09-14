import type { NeonQueryFunction } from "@neondatabase/serverless";
import type { StorageAdapter } from "grammy";
import { neon } from "@neondatabase/serverless";

export class NeonAdapter<T> implements StorageAdapter<T> {
	constructor(
		private neon: NeonQueryFunction<false, false>,
		private tableName: string,
	) {}

	async read(key: string): Promise<T | undefined> {
    console.log("read", key);
		const query = `SELECT value FROM ${this.tableName} WHERE key = $1`;
		const [result] = await this.neon(query, [key]);
		return JSON.parse(result?.value);
	}

	async write(key: string, value: T) {
		console.log("write", key, value);
		const query = `INSERT INTO ${this.tableName} (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
		await this.neon(query, [key, value]);
	}

	async delete(key: string) {
		console.log("delete", key);
		const query = `DELETE FROM ${this.tableName} WHERE key = $1`;
		await this.neon(query, [key]);
	}

	// async has(key: string): Promise<boolean> {
	// 	console.log("has", key);
	// 	const results = await this
	// 		.neon`SELECT EXISTS(SELECT 1 FROM ${this.tableName} WHERE key = ${key})`;
	// 	return results[0]?.exists;
	// }
}
