const nodemailer = require("nodemailer");
const {
    google
} = require("googleapis");
const handlebars = require("handlebars");
const {
    to,
    TE
} = require('./util.service');
const sgMail = require('@sendgrid/mail');
const fs = require("fs");
const CONFIG = require('../../config/config');
const LOG = require('../../config/logger');
const OAuth2 = google.auth.OAuth2;
const rootDirective = process.cwd();
const SENDGRID_API_KEY = CONFIG.SENDGRID_API_KEY;

const getGoogleAccessToken = async () => {
    const oauth2Client = new OAuth2(
        CONFIG.g_client_id,
        CONFIG.g_client_secret,
        CONFIG.g_redirect_url
    );

    oauth2Client.setCredentials({
        refresh_token: CONFIG.g_refresh_token
    });
    return oauth2Client.getAccessToken()
        .then(token => {
            return token;
        })
        .catch(error => {
            console.log("token> " + JSON.stringify(error));
            TE("Access token is not generated.");
        });
}

const googleTransport = async () => {
    [err, accessToken] = await to(
        getGoogleAccessToken()
    );
    return nodemailer.createTransport({
        service: CONFIG.g_service,
        auth: {
            type: "OAuth2",
            user: CONFIG.g_user,
            clientId: CONFIG.g_client_id,
            clientSecret: CONFIG.g_client_secret,
            refreshToken: CONFIG.g_refresh_token,
            accessToken: accessToken
        }
    });
};

const readHTMLFile = function (path, callback) {
    fs.readFile(path, {
        encoding: "utf-8"
    }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};

const sendEmail_BY_GOOGLE = async (emailParams, subject, templateName, attachments) => {
    [err, transporter] = await to(
        googleTransport()
    );
    readHTMLFile(
        rootDirective + "/app/email/email_template/" + templateName + ".html",
        function (err, html) {
            let template = handlebars.compile(html);
            let htmlToSend = template(emailParams);
            let mailOptions = {
                from: CONFIG.g_email_from,
                to: emailParams.recipient_email,
                subject: subject,
                generateTextFromHTML: true,
                attachments: attachments,
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    LOG.error(error);
                    callback(error);
                } else {
                    LOG.info("Email Sent : " + info.response);
                    console.log("Email Sent : " + info.response);
                }
            });
        }
    );
};
module.exports.sendEmail_BY_GOOGLE = sendEmail_BY_GOOGLE;

const sendEmail = async (emailParams, subject, templateName, attachments) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    readHTMLFile(
        rootDirective + "/app/email/email_template/" + templateName + ".html",
        function (err, html) {
            let template = handlebars.compile(html);
            let htmlToSend = template(emailParams);
            let mailOptions = {
                from: CONFIG.SENDGRID_EMAIL_FROM,
                to: emailParams.recipient_email,
                subject: subject,
                generateTextFromHTML: true,
                attachments: attachments,
                html: htmlToSend
            };
            sgMail
            .send(mailOptions)
            .then(() => {}, error => {
                console.error(error);
                if(error.response) {
                    console.error(error.response.body);
                    LOG.error(error);
                    callback(error);
                } else {
                    LOG.info("Email Sent : ");
                }
            });
        }
    );
};
module.exports.sendEmail = sendEmail;


const SEND_EMAIL_BY_NODEMAILER = async (
    dest,
    subject,
    message,
    attachments = []
) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: CONFIG.NODEMAILER_EMAIL_FROM,
                pass: CONFIG.NODEMAILER_API_KEY,
            },
        });
        // send mail with defined transport object
        const info = await transporter.sendMail({
        from: `Inertn-Hub ${process.env.nodeMailerEmail}`, // sender address
        to: dest, // list of receivers
        subject: subject, // Subject line
        html: message, // html body
        attachments,
    });
    return info;
};

module.exports.SEND_EMAIL_BY_NODEMAILER = SEND_EMAIL_BY_NODEMAILER;
