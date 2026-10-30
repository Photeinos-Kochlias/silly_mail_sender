import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());
// Serve static frontend files (index.html, etc.) from the 'public' directory
app.use(express.static('public'));

// Configure SMTP credentials (e.g., Gmail, SendGrid, Mailtrap)
const transporter = nodemailer.createTransport({
    host: "://example.com", 
    port: 587,
    secure: false, 
    auth: {
        user: "your-email@example.com",
        pass: "your-password"
    }
});

app.post('/api/send-email', async (req: Request, res: Response): Promise<void> => {
    try {
        // Read the external HTML email template
        const templatePath = path.join(__dirname, 'email-template.html');
        const htmlContent = fs.readFileSync(templatePath, 'utf8');

        const mailOptions = {
            from: '"My App" <your-email@example.com>',
            to: 'recipient@example.com', // The destination email address
            subject: 'Button Clicked Notification',
            html: htmlContent // External HTML injected here
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
