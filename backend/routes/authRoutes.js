const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');  
const User = require('../models/User');
const Item = require('../models/Item');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Set up multer for file upload (images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Set file name with timestamp
  },
});

const upload = multer({ storage: storage });

// Register a user
router.post('/register', async (req, res) => {
  const { email, password, name, phoneNumber } = req.body;
  
  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    const newUser = new User({
      email,
      password: hashedPassword, // Store the hashed password
      name,
      phoneNumber
    });

    await newUser.save();
    
    // Create a JWT token
    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).send({ message: 'User registered successfully', token });
  } catch (err) {
    res.status(500).send({ message: 'Error registering user', error: err });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email }); // Find user by email
    
    if (!user) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    // Compare the hashed password with the entered password
    const isMatch = await bcrypt.compare(password, user.password); 
    
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).send({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).send({ message: 'Error logging in', error: err });
  }
});

// Route to list a found item
router.post('/list-item', upload.single('photo'), async (req, res) => {
  const { name, description, location } = req.body;
  const photo = req.file ? req.file.path : null;

  try {
    const newItem = new Item({ name, description, location, photo });
    await newItem.save();
    res.status(201).send({ message: 'Item listed successfully', item: newItem });
  } catch (err) {
    res.status(500).send({ message: 'Error listing item', error: err });
  }
});


// User data route (protected route that requires a token)
router.get('/user', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Fetch the user from DB using the decoded ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ user });
  } catch (err) {
    res.status(403).send({ message: 'Invalid token' });
  }
});

module.exports = router;
