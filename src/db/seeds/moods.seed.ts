import "dotenv/config";
import { Pool } from "pg";

const moodSeeds = [
	{ id: 1, name: "спокойствие", color: "#FFF9C4" },
	{ id: 2, name: "признание", color: "#F1F8E9" },
	{ id: 3, name: "опасение", color: "#E0F2F1" },
	{ id: 4, name: "отвлечение", color: "#B3E5FC" },
	{ id: 5, name: "задумчивость", color: "#C5CAE9" },
	{ id: 6, name: "скука", color: "#F8BBD0" },
	{ id: 7, name: "раздражение", color: "#EF9A9A" },
	{ id: 8, name: "интерес", color: "#FFE0B2" },
	{ id: 9, name: "радость", color: "#FFF176" },
	{ id: 10, name: "доверие", color: "#C8E6C9" },
	{ id: 11, name: "страх", color: "#B2DFDB" },
	{ id: 12, name: "удивление", color: "#4FC3F7" },
	{ id: 13, name: "печаль", color: "#7986CB" },
	{ id: 14, name: "брезгливость", color: "#BA68C8" },
	{ id: 15, name: "гнев", color: "#E57373" },
	{ id: 16, name: "ожидание", color: "#FFB74D" },
	{ id: 17, name: "экстаз", color: "#FDD835" },
	{ id: 18, name: "восхищение", color: "#81C784" },
	{ id: 19, name: "ужас", color: "#80CBC4" },
	{ id: 20, name: "изумление", color: "#29B6F6" },
	{ id: 21, name: "горе", color: "#5C6BC0" },
	{ id: 22, name: "отвращение", color: "#AB47BC" },
	{ id: 23, name: "ярость", color: "#C62828" },
	{ id: 24, name: "бдительность", color: "#FB8C00" },
] as const;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	console.error("DATABASE_URL is required to run seed");
	process.exit(1);
}

const pool = new Pool({
	connectionString: databaseUrl,
});

const seedMoods = async () => {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		const values = moodSeeds.flatMap((mood) => [mood.id, mood.name, mood.color]);
		const placeholders = moodSeeds
			.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`)
			.join(",\n");

		await client.query(
			`
				INSERT INTO moods (id, name, color)
				VALUES ${placeholders}
				ON CONFLICT (id) DO UPDATE
				SET
					name = EXCLUDED.name,
					color = EXCLUDED.color
			`,
			values
		);

		await client.query(`
			SELECT setval(
				pg_get_serial_sequence('moods', 'id'),
				COALESCE((SELECT MAX(id) FROM moods), 1),
				true
			);
		`);

		await client.query("COMMIT");
		console.log(`Moods seeded: ${moodSeeds.length}`);
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Failed to seed moods", error);
		process.exitCode = 1;
	} finally {
		client.release();
		await pool.end();
	}
};

void seedMoods();
