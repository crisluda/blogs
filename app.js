var express = require("express");
app = express();
var methodOveroverride = require("method-override");
app.use(methodOveroverride("_method"));
var PORT = 3000;
var bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
var ejs = require("ejs");
app.set("view engine", "ejs");
var path = require("path");
app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog", {
  useNewUrlParser: true
});
var blogSchema = mongoose.model("blogSchame", {
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

// blogSchema.create(
//   {
//     title: "OPPO A9",
//     image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a9-2020-.jpg",
//     body:
//       "The A9 is a budget smartphone from smartphone maker Oppo. It has a big 6.5-inch fullHD+ display at the front with a waterdrop notch. ... Oppo has opted for the MediaTek Helio P70 Soc to power the A9. It is available in one variant only with 4GB of RAM and 128GB of storage."
//   },
//   function(err, data) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(blogSchema);
//     }
//   }
// );
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
  blogSchema.find({}, function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        blogs: blogs
      });
    }
  });
});

app.get("/blogs/new", function(req, res) {
  res.render("new");
});
app.post("/blogs", function(req, res) {
  blogSchema.create(req.body.blog, function(err, newBlogs) {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});
app.get("/blogs/:id", function(req, res) {
  blogSchema.findById(req.params.id, function(err, blog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {
        blog: blog
      });
    }
  });
});
app.get("/blogs/:id/edit", (req, res) => {
  blogSchema.findById(req.params.id, function(err, blog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {
        blog: blog
      });
    }
  });
});
app.put("/blogs/:id", (req, res) => {
  blogSchema.findByIdAndUpdate(req.params.id, req.body.blog, function(
    err,
    blog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
      //   or
      // res.redirect("/blogs/" + blog.id);
    }
  });
});
app.delete("/blogs/:id", function(req, res) {
  blogSchema.findOneAndDelete(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});
app.get("/*", function(req, res) {
  res.send("Err page not find");
});

app.listen(process.env.PORT || PORT, function() {
  console.log("server is runing " + PORT);
});
