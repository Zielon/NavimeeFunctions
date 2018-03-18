import { SentMessageInfo } from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

export default interface IEmailService {
    send(mail: Options): Promise<SentMessageInfo>;
}