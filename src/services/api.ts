import axios from "axios";

export interface Post {
	userId: number;
	id: number;
	title: string;
	body: string;
}

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getPosts = async (): Promise<Post[]> => {
	const response = await apiClient.get<Post[]>("/posts");
	return response.data.slice(0, 20);
	return response.data;
};

export const getPostById = async (id: number): Promise<Post> => {
	const response = await apiClient.get<Post>(`/posts/${id}`);
	return response.data;
};

export const createPost = async (postData: Omit<Post, "id">): Promise<Post> => {
	const response = await apiClient.post<Post>("/posts", postData);
	return response.data;
};

export const updatePost = async (postData: Post): Promise<Post> => {
	const response = await apiClient.put<Post>(`/posts/${postData.id}`, postData);
	return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
	await apiClient.delete(`/posts/${id}`);
};
