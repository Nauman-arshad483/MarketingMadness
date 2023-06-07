const path = require("path");
const User = require("../models/User");
const Chat = require("../models/Chat");
const jwt = require("jsonwebtoken");
const openai = require("openai");
const axios = require("axios");
const stripe = require("stripe")(process.env.NODE_STRIPE_SECRET_KEY);
// const apiKey = 'YOUR_API_KEY_HERE';
// const modelsApi = new openai.ModelsApi(apiKey);

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }
  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "that password is incorrect";
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "madness secret", {
    expiresIn: maxAge,
  });
};

//Root Route Controller || HOME
const rootRouteHandler = (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/login.html"));
};

// Dashboard Route Controller || DASHBOARD
const dashboardRouteHandler = (req, res) => {
  console.log("dashboard controller triggered")
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/dashboard.html"));
};

// Signin Route Controller || SIGNIN
const signinRouteHandlerGET = (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/sign-in.html"));
};

// Signup Route Controller || SIGNUP
const signupRouteHandlerGET = (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/sign-up.html"));
};

// Create User Controller || CREATE-USER
const createUserRouteHandlerGET = (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/phonenum.html"));
};

// Welcome Route Controller || WELCOME
const welcomeRouteHandlerGET = (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/welcome.html"));
};

//
const paymentRouteHandlerGET = (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/payment.html"));
};

//
const updateBillingRouteHandlerGET = (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/update-billing-info.html"));
};

// Photo AI Route Controller || PHOTO-AI
const photoAiRouteHandlerGET = (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/photoAi.html"));
};

// Payment success page
const successRouteHandlerGET = (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../client/success.html"));
};

// payment failed page
const failedRouteHandlerGET = (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "..client/cancel.html"));
};

// Signup request route controller || SIGNUP
const signupRouteHandlerPOST = async (req, res) => {
  console.log("backend request");
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Signin request route controller || SIGNIN
const signinRouteHandlerPOST = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
    // res.redirect("/dashboard");
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Signout Route Handler || SIGNOUT
const signoutRouteHandlerPOST = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/signin");
};



// CHAT API of OPEN-API
const textCompletionRouteHandlerPOST = async (req, res) => {
  openai.apiKey = process.env.NODE_OPENAI_API_KEY;
  var data = JSON.stringify({
    model: "text-davinci-003",
    prompt: req.body.text,
    temperature: 0.9,
    max_tokens: 1050,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });
  var config = {
    method: "post",
    url: "https://api.openai.com/v1/completions",
    headers: {
      Authorization: "Bearer " + process.env.NODE_OPENAI_API_KEY,
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return res.status(400).send(error.message);
    });
      return res.json(response);
};

// Summarization API of OPEN-AI
const summarizeRouteHandlerPOST = async (req, res) => {
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: process.env.NODE_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    if (!req.body.text) {
      res.status(400).json({ errors: "Text parameter is missing" });
      return;
    }
    console.log("req text..: ",req.body.text);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Summarize the following text: ${req.body.text}`,
      temperature: 0.5,
      max_tokens: 50,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log("/summarization in backend");
    console.log(response.data);

    const summary = response.data.choices[0].text.trim();
    res.status(200).json({ summary });
  } catch (err) {
    console.log("catch block of /summarization backend runs")
    res.status(500).json({ errors: err });
  }
};

///
/// Image Generation API of OPEN-AI
///
const imageGenerationRouteHandlerPOST = async (req, res) => {
  openai.apiKey = process.env.NODE_OPENAI_API_KEY;
  var data = JSON.stringify({
    prompt: req.body.text,
    n: 10,
    size: "1024x1024",
  });

  var config = {
    method: "post",
    url: "https://api.openai.com/v1/images/generations",
    headers: {
      Authorization: "Bearer " + process.env.NODE_OPENAI_API_KEY,
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // console.log(error);
      return res.status(400).send(error.message);
    });
  // console.log(response);
  return res.json(response);
};

//Check active user

const checkActiveUserPOST = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "madness secret", async (err, decodedToken) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        // console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.status(200).json({ user: { email: user?.email, id: user?._id } });
      }
    });
  } else {
    res.status(404).json({});
  }
};

// Chat History Controllers
const saveChatPOST = async (req, res) => {
  console.log("saveChatPost function triggered")
  const chatData = req.body;
  // console.log("chatData is : ",chatData)
  try {
    if(chatData)
    {
      const chat = new Chat(chatData);
      await chat.save();
      res.status(201).send("successfully created");
    }
    
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
const getAllChatGET = async (req, res) => {
  const user_id = req.params.id;
  try {
    const chats = await Chat.find({ user_id: user_id });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const updateChatPUT = async (req, res) => {
  console.log("updateChatPut function triggered")
  // console.log(req.body);
  const user_id = req.body.user_id;
  const content_id = req.body.content_id;
  const content = req.body.content;
  // console.log("content is : ",content);
  try {
    const chat = await Chat.updateOne(
      { user_id, _id: content_id },
      { content: content }
    );
    // console.log(chat);
    res.status(200).send("Updated chat successfully");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const deleteChatDELETE = async (req, res) => {
  const content_id = req.body.content_id;
  try {
    await Chat.deleteOne({ _id: content_id });
    res.status(200).send("delete chat successfully");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const stripePaymentPOST = async (req, res) => {
  //
  const productDetails = {
    price_data: {
      currency: "usd",
      product_data: {
        name: "Marketing Madness Api One Month Subscription",
      },
      unit_amount: 69 * 100, // for making in cent
    },
    quantity: 1,
  };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [productDetails],
      success_url: "http://103.107.184.159:7000/success_page",
      cancel_url: "http://103.107.184.159:7000/failed_page",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json(error);
  }
};

const subscribeToThePlanPOST = async (req, res) => {
  const { user, start_date, end_date } = req.body;

  try {
    const updatedUser = await User.updateOne(
      { _id: user.id, email: user.email },
      {
        subscribed: true,
        subscribed_plan: {
          start_date,
          end_date,
        },
      }
    );
    if (updatedUser.modifiedCount) {
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};

//
module.exports = {
  rootRouteHandler,
  dashboardRouteHandler,
  signinRouteHandlerGET,
  signupRouteHandlerGET,
  updateBillingRouteHandlerGET,
  signinRouteHandlerPOST,
  signupRouteHandlerPOST,
  signoutRouteHandlerPOST,
  createUserRouteHandlerGET,
  welcomeRouteHandlerGET,
  paymentRouteHandlerGET,
  photoAiRouteHandlerGET,
  textCompletionRouteHandlerPOST,
  summarizeRouteHandlerPOST,
  imageGenerationRouteHandlerPOST,
  checkActiveUserPOST,

  //Chat Route Handler
  saveChatPOST,
  getAllChatGET,
  updateChatPUT,
  deleteChatDELETE,

  // Payment
  stripePaymentPOST,
  successRouteHandlerGET,
  failedRouteHandlerGET,
  subscribeToThePlanPOST,
};
