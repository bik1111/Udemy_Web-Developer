const Review = require('../models/review');
const Campground = require('../models/campground');


module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async(req,res,next)=> {
    const { id, reviewId } = req.params;
    //두번쨰 인자는 객체 전달
    //$pull : 배열에 있는 모든 인스턴스 중 특정 조건에 만족하는 값을 지움
    // reviews 객체들 중 reviewId가 있는걸 모두 지움.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
};