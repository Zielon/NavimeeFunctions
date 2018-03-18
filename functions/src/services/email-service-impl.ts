import IEmailService from "../contracts/services/email-service";
import { injectable } from "inversify";
import * as functions from 'firebase-functions'
import { Transporter, createTransport, SentMessageInfo } from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

@injectable()
export default class EmailService implements IEmailService {

    private gmailEmail: string;
    private gmailPassword: string;
    private mailTransport: Transporter;

    constructor() {
        this.gmailEmail = functions.config().gmail.email;
        this.gmailPassword = functions.config().gmail.password;
        this.mailTransport = createTransport({
            service: 'gmail',
            auth: {
                user: this.gmailEmail,
                pass: this.gmailPassword,
            }
        });
    }

    public send(mail: Options): Promise<SentMessageInfo> {
        return this.mailTransport.sendMail(mail).then(info => console.log(info)).catch(error => console.log(error));
    }
}