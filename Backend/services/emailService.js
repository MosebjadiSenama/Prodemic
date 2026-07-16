import * as Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
import { welcomeEmail } from "../emails/welcomeEmail.js";

dotenv.config();

const api = new Brevo.TransactionalEmailsApi();

api.setApiKey(

    Brevo.TransactionalEmailsApiApiKeys.apiKey,

    process.env.BREVO_API_KEY

);

export async function sendWelcomeEmail(

    name,

    email,

    verificationLink

){

    try{

        const message = new Brevo.SendSmtpEmail();

        message.sender = {

            name: "Prodemic",

            email: "YOUR_VERIFIED_EMAIL@gmail.com"

        };

        message.to = [

            {

                email: email,

                name: name

            }

        ];

        message.subject =

        "Welcome to Prodemic 👋 Verify Your Email";

        message.htmlContent = welcomeEmail(

            name,

            verificationLink

        );

        await api.sendTransacEmail(

            message

        );

        console.log(

            "✅ Welcome email sent."

        );

    }

    catch(error){

        console.error(

            "❌ Failed to send email:",

            error.response?.body ||

            error.message

        );

    }

}