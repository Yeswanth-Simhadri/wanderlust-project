const express=require("express");
const app=express();
const mongoose = require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");


main()
.then(()=>{
    console.log("db is connected");
})
.catch((err)=>{ 
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));   



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.get("/",(req,res)=>{
    res.send("hi");
});

app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // This tells the browser that no content is available for the favicon
  });
  



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    console.log(err);
    res.render("error.ejs",{message});
    // res.status(statusCode).send(message);   
});
app.listen(8080,()=>{
    console.log("app is listening")
});



