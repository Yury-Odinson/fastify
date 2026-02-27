import { moodRepository } from "../db/index.js";
import type { MoodEntryDTO } from "../types/DTO.js";
import { AppError } from "../errors/appError.js";

class MoodService {
	constructor(private readonly repository = moodRepository) { }

	async createMoodEntry(data: MoodEntryDTO): Promise<void> {
		try {
			return this.repository.createMoodEntry({ ...data });
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in MoodService createMoodEntry:", error);
			throw new AppError("CREATE_MOOD_ENTRY_FAILED", "Failed to create mood entry", 500);
		}
	}

	async getMoodEntries(userId: number, page: number, limit: number ) {
		try {
			return this.repository.getMoodEntries(userId, page, limit	);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in MoodService getMoodEntries:", error);
			throw new AppError("GET_MOOD_ENTRIES_FAILED", "Failed to get mood entries", 500);
		}
	}
}

export const moodService = new MoodService();
