import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; 
import { Button } from "../components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { type PostFormData, postSchema } from "../lib/validators";
import type { Post } from "../services/api";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface PostFormProps {
	onSubmit: (data: PostFormData) => void;
	initialData?: Post | null;
	isSubmitting: boolean;
	submitButtonText?: string;
}

export function PostForm({
	onSubmit,
	initialData,
	isSubmitting,
	submitButtonText = "Submit Post",
}: PostFormProps) {
	// useForm is now typed with PostFormData where userId is always 'number'
	const form = useForm<PostFormData>({
		resolver: zodResolver(postSchema), // Use the updated schema
		// Set defaultValues, ensuring userId is always a number (1 if no initialData)
		defaultValues: {
			title: initialData?.title || "",
			body: initialData?.body || "",
			userId: initialData?.userId ?? 1, // Use nullish coalescing
		},
	});

	// Reset form when initialData changes, ensuring userId logic is consistent
	useEffect(() => {
		// Pass an object matching PostFormData to reset
		form.reset({
			title: initialData?.title || "",
			body: initialData?.body || "",
			userId: initialData?.userId ?? 1, // Consistent logic
		});
		// Add form.reset to dependency array as it's used inside
	}, [initialData, form.reset]);

	// This function now correctly expects PostFormData
	function handleFormSubmit(data: PostFormData) {
		onSubmit(data);
	}

	return (
		// The FormField components should now receive compatible Control types
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleFormSubmit)}
				className="space-y-6">
				<FormField
					control={form.control} // Type should now be compatible
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter post title"
									{...field}
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormDescription>
								A catchy title for your blog post.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control} // Type should now be compatible
					name="body"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Body</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Write your post content here..."
									className="resize-y min-h-[150px]"
									{...field}
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormDescription>The main content of your post.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* userId is part of the form state but not necessarily displayed */}
				{/* If you needed to display/edit it, you'd add a FormField here */}

				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full sm:w-auto">
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Processing...
						</>
					) : (
						submitButtonText
					)}
				</Button>
			</form>
		</Form>
	);
}
