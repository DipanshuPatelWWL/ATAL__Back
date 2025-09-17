const express = require('express');
require("dotenv").config();
const path = require("path");

// *****************routes****************
const faq = require("./routes/faq-Routes");
const categoryRoutes = require("./routes/category-route");
const prodcutRoutes = require("./routes/product-routes");
const review = require("./routes/review-route");
const serviceRoutes = require("./routes/service-route");
const subcategoryroute = require("./routes/subcategory-route");
const eyeCheckRoutes = require("./routes/eyeCheck-routes");
const vendorRoutes = require("./routes/vendor-route");
const customerRegistrationRoutes = require("./routes/Customer-register-routes");
const loginRoute = require("./routes/login-routes");
const adminRoute = require("./routes/auth-routes");
const wishlistRoute = require("./routes/wishlist-route");
const testimonialRoutes = require("./routes/testimonial-route");
const eyewearTipsRouter = require("./routes/eyewearTips-route");
const inquiryRoutes = require("./routes/inquiry-routes");
const userRoutes = require("./routes/user-route");
const disclaimerRoute = require("./routes/disclaimer-routes");
const eyeServicesRoute = require("./routes/our-eye-services-routes");
const contactLensRoute = require("./routes/contact-lens-route")
const companyRoutes = require("./routes/company-route");
const frameShapesRoutes = require("./routes/frame-shapes-route");
const database = require("./config/config");
const cors = require("cors");

const app = express();

// Allowed originss
const allowedOrigins = [
  // "http://localhost:5173",
  // "http://localhost:5174",
  "https://atal-home-updated.vercel.app",
  "https://atal-dashboard-updated.vercel.app",
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
database.connect();

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Basic route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// API routes
app.use("/api", faq);
app.use("/api", categoryRoutes);
app.use("/api", prodcutRoutes);
app.use("/api", serviceRoutes);
app.use("/api", subcategoryroute);
app.use("/api", review);
app.use("/api", eyeCheckRoutes);
app.use("/api", vendorRoutes);
app.use("/api", customerRegistrationRoutes);
app.use("/api", loginRoute);
app.use("/api", adminRoute);
app.use("/api", wishlistRoute);
app.use("/api", testimonialRoutes);
app.use("/api", eyewearTipsRouter);
app.use("/api", inquiryRoutes);
app.use("/api", userRoutes);
app.use("/api", disclaimerRoute);
app.use("/api", eyeServicesRoute);
app.use("/api", contactLensRoute);
app.use("/api", companyRoutes);
app.use("/api", frameShapesRoutes);
// app.use("/api/products", product-routes);


const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Server started on Port: ${PORT}`);
});
