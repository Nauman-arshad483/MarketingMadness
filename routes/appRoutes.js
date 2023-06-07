const express = require("express");
const router = express.Router();
const {
  rootRouteHandler,
  dashboardRouteHandler,
  photoAiRouteHandlerGET,
  signinRouteHandlerGET,
  signupRouteHandlerGET,
  createUserRouteHandlerGET,
  welcomeRouteHandlerGET,
  paymentRouteHandlerGET,
  signupRouteHandlerPOST,
  signinRouteHandlerPOST,
  signoutRouteHandlerPOST,
  textCompletionRouteHandlerPOST,
  summarizeRouteHandlerPOST,
  imageGenerationRouteHandlerPOST,
  checkActiveUserPOST,

  //Chat Route Handler
  saveChatPOST,
  getAllChatGET,
  updateChatPUT,
  deleteChatDELETE,

  //Payment
  stripePaymentPOST,
  successRouteHandlerGET,
  failedRouteHandlerGET,
  subscribeToThePlanPOST,
  updateBillingRouteHandlerGET,
} = require("../controllers/routesControllers");
const { requireAuth ,checkAuth} = require("../middleware/authMiddleware");

router.get("/", rootRouteHandler);
router.get("/dashboard",dashboardRouteHandler);
router.get("/photo-ai", requireAuth, photoAiRouteHandlerGET);
router.get("/signin", signinRouteHandlerGET);
router.get("/signup", signupRouteHandlerGET);
router.get("/payment", paymentRouteHandlerGET);
router.get("/update-billing-info", updateBillingRouteHandlerGET);
// router.get("/create-user", createUserRouteHandlerGET);
router.get("/welcome", checkAuth, welcomeRouteHandlerGET);
router.post("/signup", signupRouteHandlerPOST);
router.post("/signin", signinRouteHandlerPOST);
router.post("/text-completion", textCompletionRouteHandlerPOST);
router.post("/summarization", summarizeRouteHandlerPOST);
router.post("/image-generation", imageGenerationRouteHandlerPOST);
router.post("/check-active-user", checkActiveUserPOST);
router.post("/signout", signoutRouteHandlerPOST);

// chat database handling
router.post("/chat", saveChatPOST);
router.get("/chats/:id", getAllChatGET);
router.put("/chat", updateChatPUT);
router.delete("/chat", deleteChatDELETE);

// PAYMENT HANDLEING
router.get("/success_page", successRouteHandlerGET);
router.get("/failed_page", failedRouteHandlerGET);
router.post("/stripe-payment", stripePaymentPOST);
router.post("/subscribe", subscribeToThePlanPOST);

module.exports = router;
