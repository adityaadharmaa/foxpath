export interface User {
    // id: number
    username: string
    email: string
    role: string
}

export interface LoginResponse {
    status: string,
    message: string,
    data : {
        user: User,
    }
    token : {
        access_token: string,
        token_type: string,
        expires_at: string
    }
    meta: {
        redirect_to: string
    }
}

export interface LoginPayload {
    login: string,
    password: string,
    remember_me?: boolean
}