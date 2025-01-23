const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { reviewSchema }=require("../schema.js"); 
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");


//Review routes
//add review
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next(); 
    }
}

router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);
    
    await listing.save();
    await newReview.save();
    req.flash("success","New Review Added!");
    res.redirect(`/listings/${listing._id}`);

}));

//delete review route
router.delete("/:reviewid",wrapAsync(async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","New Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;