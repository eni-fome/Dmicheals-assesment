import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Post } from "../services/api";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";


// Define action handlers type
export interface PostActions {
	onEdit: (post: Post) => void;
	onDelete: (post: Post) => void;
}

export const getColumns = (actions: PostActions): ColumnDef<Post>[] => [
	{
		accessorKey: "id",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					ID
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div className="ml-4">{row.getValue("id")}</div>, // Add margin for alignment
	},
	{
		accessorKey: "title",
		header: "Title",
		cell: ({ row }) => (
			<div className="font-medium truncate max-w-xs md:max-w-md lg:max-w-lg">
				{row.getValue("title")}
			</div>
		), // Add truncation and responsive max-width
	},
	{
		accessorKey: "body",
		header: "Body",
		cell: ({ row }) => (
			<div className="truncate max-w-sm md:max-w-lg lg:max-w-xl text-muted-foreground">
				{row.getValue("body")}
			</div>
		), // Truncate and style
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const post = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(post.id.toString())}>
							Copy Post ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => actions.onEdit(post)}>
							<Pencil className="mr-2 h-4 w-4" />
							Edit Post
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => actions.onDelete(post)}
							className="text-red-600 focus:text-red-700 focus:bg-red-50">
							<Trash2 className="mr-2 h-4 w-4" />
							Delete Post
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
