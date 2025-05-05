// src/lib/validators.ts
import { z } from "zod";

export const postSchema = z.object({
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters long." })
		.max(100, { message: "Title cannot exceed 100 characters." }),
	body: z
		.string()
		.min(10, { message: "Body must be at least 10 characters long." })
		.max(1000, { message: "Body cannot exceed 1000 characters." }),
	userId: z
		.number()
		.int()
		.positive({ message: "User ID must be a positive number." }),
});

export type PostFormData = z.infer<typeof postSchema>;
