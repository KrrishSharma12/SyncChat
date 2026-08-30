import "dotenv/config";
import { Resend } from "resend";
import { render } from "@react-email/render";
import VerificationEmail from "./Email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<{ success: boolean; message: string }> {

    try {
        const emailHtml = await render(
            VerificationEmail({
                username,
                otp: verifycode,
            })
        );

        const { data, error } = await resend.emails.send({
            from: "SyncChat <noreply@krrishlabs.tech>",
            to: [email],
            subject: "Verify your email address",
            html: emailHtml,
        });

        if (error) {
            console.log("Resend error:", error);

            return {
                success: false,
                message: "Failed to send verification email",
            };
        }

        console.log("Email sent:", data);

        return {
            success: true,
            message: "Verification email sent successfully",
        };

    } catch (emailError) {
        console.log("Error sending verification email:", emailError);

        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}