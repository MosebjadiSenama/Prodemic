import express from "express";

//import { sendWelcomeEmail } from "../services/emailService.js";

const router = express.Router();

//==================================================
// SEND WELCOME EMAIL
//==================================================

router.post(

    "/send-welcome-email",

    async(req,res)=>{

        try{

            const{

                name,

                email,

                verificationLink

            } = req.body;

            if(

                !name ||

                !email ||

                !verificationLink

            ){

                return res.status(400).json({

                    error:"Missing required fields."

                });

            }

            //await sendWelcomeEmail(

             //   name,

              //  email,

               // verificationLink

          //  );

           // res.json({

            //    success:true

           // });

        }

        catch(error){

            console.error(error);

            res.status(500).json({

                error:error.message

            });

        }

    }

);

export default router;