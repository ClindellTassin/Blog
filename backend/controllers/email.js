import expressAyncHandler from "express-async-handler"
import sgMail from "@sendgrid/mail"
import Filter from "bad-words"
import Email from "../models/Email.js"

const sendEmail = expressAyncHandler(async (req, res) => {
    const { to, subject, message } = req.body;

    const email = subject + '' + message;
    const filter = new Filter();
    const isProfane = filter.isProfane(email);
    if (isProfane) throw new Error('Email failed to send - must not contain profaity');

    try {
        const msg = {
            to,
            subject,
            text: message,
            from: 'clindell.tassin@selu.edu',
        };

        await sgMail.send(msg);
        await Email.create({
            sentBy: req?.user?._id,
            from: req?.user?.email,
            to,
            message,
            subject
        });
        res.json('Email sent successfully');
    } catch (error) {
        res.json(error);
    }
});

export {
    sendEmail
}