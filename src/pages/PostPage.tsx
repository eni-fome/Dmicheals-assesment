import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getPosts,
	createPost,
	updatePost,
	deletePost,
	type Post,
} from "../services/api";
import { DataTable } from "../components/DataTable";
import { Button } from "../components/ui/button";
import { PlusCircle, Loader2, AlertCircle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { PostForm } from "../components/PostForm";
import type { PostFormData } from "../lib/validators";
import { toast } from "sonner"; // Using Sonner
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";
import { getColumns, type PostActions } from "../components/column";

export function PostsPage() {
	const queryClient = useQueryClient();
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);

	// --- Data Fetching ---
	const {
		data: posts,
		isLoading,
		isError,
		error,
	} = useQuery<Post[], Error>({
		queryKey: ["posts"],
		queryFn: getPosts,
		// Keep data around for a bit longer, maybe useful if navigating away and back
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes
	});

	// --- Mutations ---

	// ADD POST Mutation
	const addMutation = useMutation({
		mutationFn: createPost,
		onSuccess: (newPost) => {
			// ** FIX for JSONPlaceholder **
			// Manually update the query cache to include the new post
			// because JSONPlaceholder doesn't actually save it, so invalidating
			// and refetching would make the new post disappear.
			queryClient.setQueryData(["posts"], (oldData: Post[] | undefined) => {
				// If cache is empty or undefined, return an array with the new post
				if (!oldData) return [newPost];
				// Otherwise, return the old data array with the new post prepended
				return [newPost, ...oldData];
			});

			// Don't invalidate here for JSONPlaceholder:
			// queryClient.invalidateQueries({ queryKey: ['posts'] });

			toast.success("Post Created (Simulated)", {
				description: `Added post "${newPost.title}" (ID: ${newPost.id}) to the list. Changes are not saved on the server.`,
			});
			setIsAddDialogOpen(false); // Close dialog on success
		},
		onError: (error: Error) => {
			toast.error("Error Creating Post", {
				description:
					error.message || "Could not add the post. Please try again.",
			});
		},
	});

	// EDIT POST Mutation
	const editMutation = useMutation({
		mutationFn: updatePost,
		onSuccess: (updatedPost) => {
			// For JSONPlaceholder, invalidating is okay. It refetches the original list,
			// effectively showing that the API didn't *really* save the change.
			// Alternatively, you could manually update the cache like in addMutation
			// using setQueryData if you want the UI to *look* like it saved.
			queryClient.invalidateQueries({ queryKey: ["posts"] });

			// Example of manual update (if you prefer UI persistence simulation):
			// queryClient.setQueryData(['posts'], (oldData: Post[] | undefined) =>
			//    oldData?.map(post => post.id === updatedPost.id ? updatedPost : post) ?? []
			// );

			toast.success("Post Update Simulated", {
				description: `API confirmed update for post "${updatedPost.title}". Refetching list. Changes are not saved on the server.`,
			});
			setIsEditDialogOpen(false); // Close dialog
			setSelectedPost(null);
		},
		onError: (error: Error) => {
			toast.error("Error Updating Post", {
				description:
					error.message || "Could not update the post. Please try again.",
			});
			// Optionally keep dialog open on error? Or close it?
			// setIsEditDialogOpen(false);
			// setSelectedPost(null);
		},
	});

	// DELETE POST Mutation
	const deleteMutation = useMutation({
		mutationFn: deletePost,
		onSuccess: (_, _deletedPostId) => {
			// mutationFn receives id, onSuccess doesn't get it directly
			// We rely on selectedPost.id if needed for manual update

			// Similar to edit, invalidating reflects JSONPlaceholder's behavior (doesn't persist).
			queryClient.invalidateQueries({ queryKey: ["posts"] });

			// Example of manual update (if you prefer UI persistence simulation):
			const idToDelete = selectedPost?.id; // Get id before clearing selectedPost
			if (idToDelete) {
				queryClient.setQueryData(
					["posts"],
					(oldData: Post[] | undefined) =>
						oldData?.filter((post) => post.id !== idToDelete) ?? []
				);
			}

			toast.success("Post Delete Simulated", {
				description: `API confirmed deletion for post ID: ${selectedPost?.id}. Refetching list. Changes are not saved on the server.`,
			});
			setIsDeleteDialogOpen(false); // Close dialog
			setSelectedPost(null);
		},
		onError: (error: Error) => {
			toast.error("Error Deleting Post", {
				description:
					error.message || "Could not delete the post. Please try again.",
			});
			setIsDeleteDialogOpen(false); // Close dialog even on error
			setSelectedPost(null);
		},
	});

	// --- Event Handlers ---
	const handleAddSubmit = (data: PostFormData) => {
		// userId is guaranteed by the form validation/defaults
		addMutation.mutate(data);
	};

	const handleEditSubmit = (data: PostFormData) => {
		if (!selectedPost) return;
		// Merge existing id with form data (title, body, potentially userId if editable)
		editMutation.mutate({ ...selectedPost, ...data });
	};

	const handleDeleteConfirm = () => {
		if (!selectedPost) return;
		deleteMutation.mutate(selectedPost.id);
	};

	// Handlers to open dialogs and set the currently selected post
	const openEditDialog = (post: Post) => {
		console.log("Opening edit dialog for post:", post); // Debug log
		setSelectedPost(post);
		setIsEditDialogOpen(true);
	};

	const openDeleteDialog = (post: Post) => {
		console.log("Opening delete dialog for post:", post); // Debug log
		setSelectedPost(post);
		setIsDeleteDialogOpen(true);
	};

	// --- Table Columns Definition ---
	// useMemo ensures these objects/functions aren't recreated on every render unnecessarily
	const postActions: PostActions = useMemo(
		() => ({
			onEdit: openEditDialog,
			onDelete: openDeleteDialog,
			// Add onView: openViewDialog here if you implement the view feature
		}),
		[]
	); // Empty dependency array means this object is created once

	const columns = useMemo(() => getColumns(postActions), [postActions]);

	// --- Loading & Error UI ---
	if (isLoading) {
		return (
			<div className="container mx-auto p-4 md:p-8 space-y-4">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
					<h1 className="text-2xl md:text-3xl font-bold">
						Blog Posts Management
					</h1>
					<Skeleton className="h-10 w-36" /> {/* Skeleton for Add Button */}
				</div>
				<Skeleton className="h-10 w-full max-w-sm mb-4" />{" "}
				{/* Skeleton for Filter */}
				<div className="rounded-md border">
					{/* Simulate table header */}
					<div className="h-12 bg-muted border-b"></div>
					{/* Simulate table rows */}
					<Skeleton className="h-16 w-full border-b" />
					<Skeleton className="h-16 w-full border-b" />
					<Skeleton className="h-16 w-full border-b" />
					<Skeleton className="h-16 w-full border-b" />
					<Skeleton className="h-16 w-full" />
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container mx-auto p-4 md:p-8">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error Fetching Posts</AlertTitle>
					<AlertDescription>
						{error?.message ||
							"An unexpected error occurred. Please try refreshing the page."}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	// --- Render Page ---
	return (
		<div className="container mx-auto p-4 md:p-8">
			{/* Header Section */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
				<h1 className="text-2xl md:text-3xl font-bold tracking-tight">
					Blog Posts Management
				</h1>
				{/* Add Post Dialog Trigger & Content */}
				<Dialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<PlusCircle className="mr-2 h-4 w-4" /> Add New Post
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px] md:max-w-lg max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Add New Post</DialogTitle>
							<DialogDescription>
								Fill in the details below. New posts appear locally but are not
								saved on the server.
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<PostForm
								onSubmit={handleAddSubmit}
								isSubmitting={addMutation.isPending} // Use isPending for mutation status
								submitButtonText="Create Post"
							/>
						</div>
						{/* Footer removed as submit button is inside PostForm */}
					</DialogContent>
				</Dialog>
			</div>

			{/* Posts Data Table */}
			{/* Pass memoized columns and fetched posts data */}
			<DataTable
				columns={columns}
				data={posts || []}
			/>

			{/* Edit Post Dialog */}
			<Dialog
				open={isEditDialogOpen}
				onOpenChange={(isOpen) => {
					setIsEditDialogOpen(isOpen);
					if (!isOpen) setSelectedPost(null); // Clear selected post when closing
				}}>
				<DialogContent className="sm:max-w-[425px] md:max-w-lg max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Edit Post</DialogTitle>
						<DialogDescription>
							Update the details for post ID: {selectedPost?.id}. Changes are
							not saved on the server.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						{/* Render form only when selectedPost exists */}
						{selectedPost && (
							<PostForm
								onSubmit={handleEditSubmit}
								initialData={selectedPost}
								isSubmitting={editMutation.isPending} // Use isPending for mutation status
								submitButtonText="Save Changes"
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={(isOpen) => {
					setIsDeleteDialogOpen(isOpen);
					if (!isOpen) setSelectedPost(null); // Clear selected post when closing
				}}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone (locally simulated). This will
							attempt to delete the post titled "{selectedPost?.title}".
							Deletions are not saved on the server.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleteMutation.isPending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							disabled={deleteMutation.isPending} // Use isPending for mutation status
							className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500" // Destructive style
						>
							{deleteMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
								</>
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
