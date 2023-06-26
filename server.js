const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Activity = require('./models/activities');
const app = express();

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, 'your_secret_key', (err, decoded) => {
      if (err) {
        res.status(403).send('Invalid token');
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(403).send('No token provided');
  }
};

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  try {
    await mongoose.connect('mongodb+srv://jl:1111@cluster0.ie0zxse.mongodb.net/activities_db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    const user = new User({ email, password, name });
    await user.save();
    console.log('User account information stored in database');
    res.status(200).send('Register successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error storing user account information');
  } finally {
    mongoose.disconnect();
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await mongoose.connect('mongodb+srv://jl:1111@cluster0.ie0zxse.mongodb.net/activities_db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await User.findOne({ email });

    if (user) {
      let isPasswordCorrect;
      
      
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        
        isPasswordCorrect = await bcrypt.compare(password, user.password);
      } else {
        
        isPasswordCorrect = (password === user.password);
      }

      if (isPasswordCorrect) {
        console.log('Login successful');
        const token = jwt.sign({ email }, 'your_secret_key', { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        console.error('Incorrect password');
        res.status(401).send('Incorrect password');
      }
    } else {
      console.error('Email not found');
      res.status(401).send('Email not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  } finally {
    mongoose.disconnect();
  }
});
app.post('/submit', verifyToken, async (req, res) => {
  const name = req.body.name;
  const activity = req.body.activity;
  const email = req.user.email;

  try {
    await mongoose.connect('mongodb+srv://jl:1111@cluster0.ie0zxse.mongodb.net/activities_db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    const act = new Activity({ name, email, activity });
    await act.save();
    console.log('Activity information stored in database');
    res.status(200).send('Activity submission successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error storing activity information');
  } finally {
    mongoose.disconnect();
  }
});

app.listen(8080, () => {
  console.log('Server running at http://localhost:8080/');
});