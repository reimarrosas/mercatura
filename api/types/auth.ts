export type UserData = {
    id: number;
    name: string;
    email: string;
}

export type SignupCredentials = LoginCredentials & {
    name: string;
    confirmPassword: string;
}

export type LoginCredentials = {
    email: string;
    password: string;
}