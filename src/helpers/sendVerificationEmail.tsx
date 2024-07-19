import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email:string,username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        const verifyMethod = VerificationEmail({ username, otp: verifyCode });
        const response = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "FeedBack message | Verification Code",
            react: verifyMethod,
        });
        console.log("Email sent", response);
        return {
            success: true,
            message: "Verification email sent",
        };
    } catch (error) {
        console.log("Error sending verification email", error);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}