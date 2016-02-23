var     express          = require("express"),
        bodyParser       = require("body-parser"),
        methodOverride   = require("method-override"),
        expressSanitizer = require("express-sanitizer"),
        mongoose         = require("mongoose"),
        app              = express();
        


//App Config        
mongoose.connect("mongodb://localhost/blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//Mongoose Model Config     
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema);

//Routes


app.get("/", function(req, res){
    res.redirect("blogs");
});

//Index Route

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("error");
        } else {
          res.render("index", {blogs: blogs}); 
        }
    });
    
});

// New Route

app.get("/blogs/new", function(req,res){
    res.render("new");
});

// Create Route

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log("Error in creating new post");
        } else {
            res.redirect("/blogs");
        }
    });
});

// Show Route

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("show", {blog: foundBlog})
        }
    });
});

// Edit Route

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
        console.log(err);
    } else {
    res.render("edit", {blog: foundBlog});    
    }
    });
});

// Update Route

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Destroy Route

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            console.log(err) 
            } else {
                res.redirect("/blogs");    
            }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});