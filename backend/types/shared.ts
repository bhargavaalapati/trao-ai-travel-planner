export interface User {
    _id: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}