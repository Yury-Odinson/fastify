import { moodRepository } from "../db/index.js";
import type {
	ImportMoodEntriesResultDTO,
	ImportMoodEntryDTO,
	MoodEntryDTO,
	UpdateMoodEntryDTO
} from "../types/DTO.js";
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

	async importMoodEntries(userId: number, entries: ImportMoodEntryDTO[]): Promise<ImportMoodEntriesResultDTO> {
		try {
			if (entries.length === 0) {
				throw new AppError("EMPTY_IMPORT", "Entries list must not be empty", 400);
			}

			for (const entry of entries) {
				if (!entry.clientEntryId || !entry.moodId || !entry.createdAt) {
					throw new AppError("INVALID_IMPORT_ENTRY", "Invalid mood entry payload", 400);
				}

				const createdAt = new Date(entry.createdAt);
				if (Number.isNaN(createdAt.getTime())) {
					throw new AppError("INVALID_IMPORT_DATE", "Invalid createdAt in mood entry", 400);
				}

				if (entry.updatedAt) {
					const updatedAt = new Date(entry.updatedAt);
					if (Number.isNaN(updatedAt.getTime())) {
						throw new AppError("INVALID_IMPORT_DATE", "Invalid updatedAt in mood entry", 400);
					}
				}
			}

			return this.repository.importMoodEntries({ userId, entries });
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in MoodService importMoodEntries:", error);
			throw new AppError("IMPORT_MOOD_ENTRIES_FAILED", "Failed to import mood entries", 500);
		}
	}

	async updateMoodEntry(userId: number, data: UpdateMoodEntryDTO): Promise<void> {
		try {
			if (data.moodId === undefined && data.note === undefined) {
				throw new AppError("EMPTY_UPDATE_PAYLOAD", "At least one field is required: moodId or note", 400);
			}

			const isUpdated = await this.repository.updateMoodEntry(userId, data);
			if (!isUpdated) {
				throw new AppError("MOOD_ENTRY_NOT_FOUND", "Mood entry not found", 404);
			}
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in MoodService updateMoodEntry:", error);
			throw new AppError("UPDATE_MOOD_ENTRY_FAILED", "Failed to update mood entry", 500);
		}
	}

	async deleteMoodEntry(userId: number, entryId: number): Promise<void> {
		try {
			const isDeleted = await this.repository.deleteMoodEntry(userId, entryId);
			if (!isDeleted) {
				throw new AppError("MOOD_ENTRY_NOT_FOUND", "Mood entry not found", 404);
			}
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in MoodService deleteMoodEntry:", error);
			throw new AppError("DELETE_MOOD_ENTRY_FAILED", "Failed to delete mood entry", 500);
		}
	}
}

export const moodService = new MoodService();
