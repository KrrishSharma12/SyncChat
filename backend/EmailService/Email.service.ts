
import "dotenv/config";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "./Email";



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

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

        await transporter.sendMail({
            from: `"SyncChat" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Verify your email address",
            html: emailHtml,
        });

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

