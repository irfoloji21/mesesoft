const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// burada kullandığınız porta izin veriniz. 
// Sadece test için kullanılmalıdır. 
// ilerleyen zamanlarda değiştirilmelidir. öpüldünüz...
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4200'  ,'http://localhost:62230' ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// yeni model ve controller eklendikçe buradan route belirtilecek.
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const category = require("./controller/category");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");
const koleksiyon = require("./controller/koleksiyon");
const blog = require("./controller/blog");

app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/category", category);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);
app.use("/api/v2/koleksiyon", koleksiyon);
app.use("/api/v2/blog", blog);


app.use(ErrorHandler);

module.exports = app;
