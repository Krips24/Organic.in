const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors"); // Import the cors module

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dotenv = require("dotenv");

// Create an instance of Express
const app = express();

dotenv.config();

const port = 3001; // You can choose any available port
app.use(cors());
app.use(express.json());

// mongodb
mongoose.connect("mongodb://localhost:27017/organicDB");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // If email already registered, send an error response
      return res.status(400).json({ error: "Email already registered" });
    }

    // If email is not registered, proceed with user registration
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).send("Successfully Registered");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while registering." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.email;
    const password = req.body.password;

    const foundUser = await User.findOne({ email: username });

    if (foundUser) {
      const result = await bcrypt.compare(password, foundUser.password);
      if (result) {
        res.status(200).send("Login Successful");
      } else {
        res.status(401).json({ error: "Incorrect Password" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
});

// gemini ai

// Assuming you have initialized genAI properly
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// API endpoint for generating content
app.post("/generate-content", async (req, res) => {
  try {
    // Assuming req.body.data contains the prompt
    const prompt = req.body.data;
    const height = req.body.height;
    const weight = req.body.weight;
    const gender = req.body.gender;
    const selectedGender = Object.keys(gender).find((key) => gender[key]);
    const activity = req.body.activity;
    const selectedActivity = Object.keys(activity).find((key) => activity[key]);
    const dietaryPreferences = req.body.dietaryPreferences;
    const selectedDietaryPreferences = Object.keys(dietaryPreferences).find(
      (key) => dietaryPreferences[key]
    );
    const target = req.body.target;
    const selectedTarget = Object.keys(target).find((key) => target[key]);
    console.log(req.body);

    // Generate content using the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(
      "calculat BMI and generate recipes and give each and every detail of how much protein, carbs, fats and calories the person should eat and provide food with recipes from where the person can eat, all the necassay deatils are give below:  Height is:  " +
        height +
        " Weight is: " +
        weight +
        " Dietary Preference as: " +
        selectedDietaryPreferences +
        " gender " +
        selectedGender +
        " with Acitivity Level of:  " +
        selectedActivity +
        " with Target of  " +
        selectedTarget +
        " with additional input as:  " +
        prompt +
        " from these information, tell if the person is normal, overweight or underweight and provide any necassary feedback you want to provide, and please dont provide any answer, if the question is not related to food, thank you "
    );
    const response = await result.response;
    const text = response.text();
    console.log(text);

    // Send the generated text as JSON response
    res.status(200).json({ text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
