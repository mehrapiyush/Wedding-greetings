const express = require('express');
const app = express();
const port = 3000;
const twilio = require('twilio');
const accountSid = 'AC83e24f356b6979e0323ba4216b3f1ba8'; 
const authToken = '8547c769e12e7a93f78c07c851ee22be'; 
const client = new twilio(accountSid, authToken);

// Middleware for parsing JSON data
app.use(express.json());
app.use(express.static('public'));
  
// Route to handle greeting submissions
app.post('/api/greetings',(req, res) => {
    const { name, message} = req.body;
    const phone = "whatsapp:+919154832127"
    // upload image to local server
    const image  = "";

    sendGreetings(name, message, phone, image, res);

});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function sendGreetings(name, message, phone, res) {
    client.messages
        .create({
            from: 'whatsapp:+14155238886', // Your Twilio sandbox WhatsApp number
            to: phone, // User's WhatsApp number
            body: `Hello ${name}, thank you for submitting your wedding greeting! Your message: "${message}"`
        })
        .then((message) => {
            console.log('WhatsApp message sent:', message.sid);
            res.status(200).send({ success: true, message: 'Greeting submitted and WhatsApp message sent!' });
        })
        .catch((err) => {
            console.error('Error sending WhatsApp message:', err);
            res.status(500).send({ success: false, message: 'Failed to send WhatsApp message.' });
        });
}

