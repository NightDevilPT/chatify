// interfaces/user.interface.ts

export interface User {
	id: string;
	email: string;
	password: string; // You can ignore this field or exclude it on the frontend if you don't need it.
	token: string;
	isVerified: boolean;
	username: string;
	createdAt: string; // ISO string
	updatedAt: string; // ISO string
}
