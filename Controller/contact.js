const ContactModel = require("../models/Contact.Model");


const Contact = async (req, res) => {
  try {
    console.log("Form Data Received:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
   const newContact = new ContactModel({ name, email, message });
   await newContact.save();


    return res.status(200).json({ message: "Message Send Successfully!" });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = Contact;



