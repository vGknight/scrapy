// Dependencies
var express = require("express");
// var mongojs = require("mongojs");
var mongoose = require("mongoose");

var logger = require("morgan");


var bodyParser = require("body-parser");
// Initialize Express
var app = express();
// Require request and cheerio. This makes the scraping possible
// Set Handlebars.
var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.engine('handlebars', exphbs({
    defaultLayout: "main",
    helpers: {
        // Function to do basic mathematical operation in handlebar
        math: function(lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        }

    }
}));
app.set("view engine", "handlebars");
var request = require("request");
// var axios = require("axios");
var cheerio = require("cheerio");


// Require all models
var db = require("./models");

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scrapy", {
    useMongoClient: true
});


app.get("/", function(req, res) {
    db.Article
        .find({})
        .then(function(dbArticle) {

            var hbsObject = {
                article: dbArticle
            };
            console.log(hbsObject);

            res.render("index", hbsObject);


        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});

// Route for getting all saved Articles from the db
app.get("/saved", function(req, res) {
    // Grab every document in the Articles collection
    db.Article
        .find({ isSaved: true })
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client

            var hbsObject = {
                article: dbArticle
            };
            console.log(hbsObject);

            res.render("saved", hbsObject);
        })
        .catch(function(err) {

            res.json(err);
        });
});


app.get("/scrape", function(req, res) {

    request("https://www.clevescene.com/cleveland/dining/Section?oid=1392921", function(error, response, html) {

        // Load the HTML into cheerio
        var $ = cheerio.load(html);

        $(".SectionStoriesTeaser").each(function(i, element) {
            var result = {};
            result.headline = $(element).find(".headline").find("a").text();
            result.summary = $(element).find(".summarytext")[0].children[0].data;
            result.link = $(element).find("a").attr('href');
            result.author = $(element).find(".author").text();
            result.relDate = $(element).find(".releaseDate").text().trim();

            var query = { headline: result.headline };
            var update = result;
            var options = { upsert: true, setDefaultsOnInsert: true };

            db.Article
                .findOneAndUpdate(query, update, options)
                .then(function(dbArticle) {

                    res.send("Scrape Complete");

                })
                .catch(function(err) {

                    res.json(err);
                });
        });


    });


});

app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article
        .find({})
        .then(function(dbArticle) {

            res.json(dbArticle);
        })
        .catch(function(err) {
      
            res.json(err);
        });
});


app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article
        .findOne({ _id: req.params.id })
        //populate 
        .populate("note")
        .then(function(dbArticle) {

            res.json(dbArticle);
        })
        .catch(function(err) {

            res.json(err);
        });
});

app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    console.log(req.body);
    db.Note
        .create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {

            res.json(dbArticle);
        })
        .catch(function(err) {

            res.json(err);
        });
});

app.post("/save/:id", function(req, res) {
    // markes article id as saved
    db.Article

        .findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(function(dbArticle) {

            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


app.post("/unsave/:id", function(req, res) {

    db.Article
        .findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});