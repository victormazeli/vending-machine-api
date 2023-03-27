import nodemailer from 'nodemailer';

export const sendTestMail = async (email, subject, body) => {
    let transporter = nodemailer.createTransport({
        port: 1025
    });

    const message = {
        from: 'no-reply@metrodao.app',
        to: email,
        subject: 'Metrodao -' + subject,
        text: body
    }

    try {
        await transporter.sendMail(message);
        return true
    } catch (error) {
        console.log(error)
        return false
    }

}
