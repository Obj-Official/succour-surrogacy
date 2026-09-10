import axios from 'axios';

type to = {
    email: string;
    name: string;
};
type attachment = {
    content: string;
    name: string;
}

interface MailParams {
  to: to[];
  subject: string;
  htmlContent: string;
  attachment?: attachment[];
}

export const sendEmail = async (mail: MailParams) => {
    try {
        const response = await axios.post(
        'https://brevo-email-proxy.davidezeani11.workers.dev/',
        {
            sender: {
                name: 'Succor Surrogacy',
                email: 'davidezeani11@gmail.com'//'no.reply@nurturepath.com'//nuturepathsurrogacyservice@gmail.com
            },
            to: mail.to,//[{ email: "davidezeani11@gmail.com", name: "David Ezeani" }],
            subject: mail.subject,
            htmlContent: mail.htmlContent,
            attachment: mail.attachment
        }
        );
        console.log('Email sent', response.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
