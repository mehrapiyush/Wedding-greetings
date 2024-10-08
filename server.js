const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const twilio = require('twilio');
const bodyParser = require('body-parser');
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC83e24f356b6979e0323ba4216b3f1ba8'; 
const authToken = process.env.TWILIO_AUTH_TOKEN || '65a0bb77524e5b90f3f13ad309fc0f38'; 
const client = new twilio(accountSid, authToken);

//Midleware
app.use(bodyParser.json()); // To parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const multer = require('multer');
const path = require('path');

// Serve the uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Directory to save the uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
  },
});

const upload = multer({ storage });

// Ensure uploads directory exists
const fs = require('fs');
const dir = 'uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
  
// Route to handle greeting submissions
app.post('/api/greetings',upload.single('image'),(req, res) => {
   
    // upload image to local server
    console.log(req.file);
    if(req.file) {
        const { name, phone, message} = req.body;
       const fileUrl = `${req.protocol}s://${req.get('host')}/uploads/${req.file.filename}`;
       // const fileUrl = "https://7d87-49-36-137-142.ngrok-free.app"+`/uploads/${req.file.filename}`;
        
        console.log('Uploaded file:', req.file.filename);
        console.log('File URL:', fileUrl); 
        client.messages
            .create({
                from: 'whatsapp:+14155238886', // Your Twilio sandbox WhatsApp number
                to: "whatsapp:+91"+phone, // User's WhatsApp number
                body: `Hello ${name}, Thank you for submitting your wedding greetings! We have shared the following greetings with bride and groom \n Your Greetings: "${message}"`,
                mediaUrl: [fileUrl]
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

});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

