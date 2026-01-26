import { moodRepository } from "../db/index.js";
import type { MoodEntryDTO } from "../types/DTO.js";

class MoodService {
	constructor(private readonly repository = moodRepository) { }

	async createMoodEntry(data: MoodEntryDTO): Promise<void> {
		try {
			return this.repository.createMoodEntry({ ...data });
		} catch (error) {
			console.error("Error in MoodService createMoodEntry:", error);
			throw new Error("Failed to create mood entry in service layer");
		}
	}

	async getMoodEntries(userId: number, page: number, limit: number ) {
		try {
			return this.repository.getMoodEntries(userId, page, limit	);
		} catch (error) {
			console.error("Error in MoodService getMoodEntries:", error);
			throw new Error("Failed to get mood entries in service layer");
		}
	}
}

export const moodService = new MoodService();
