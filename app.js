const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const methodOverride = require("method-override");
const upload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");
//var Chart = require('chart.js');
const date = require("date-and-time");
const { mongoDbUrl } = require("./config/database");
mongoose.Promise = global.Promise;
mongoose
  .connect(mongoDbUrl)
  .then(db => {
    console.log("Mongo connected");
  })
  .catch(error => console.log(error));

app.use(express.static(path.join(__dirname, "public")));
const {
  generateDate,
  paginate,
  stripTags,
  truncate
} = require("./helper/handlebars-helper");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "home",
    helpers: {
      generateDate: generateDate,
      paginate: paginate,
      stripTags: stripTags,
      truncate: truncate
    }
  })
);
app.set("view engine", "handlebars");
app.use(upload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "diksha123",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  next();
});

const home = require("./routes/home/index");
const admin = require("./routes/admin/index");
const posts = require("./routes/admin/posts");
const categories = require("./routes/admin/categories");
const comments = require("./routes/admin/comments");
app.use("/", home);
app.use("/admin", admin);
app.use("/admin/posts", posts);
app.use("/admin/categories", categories);
app.use("/admin/comments", comments);
const port = process.env.PORT || 4500;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
