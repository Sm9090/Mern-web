import { message } from "@/model/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: message[]
    data?: any;
}