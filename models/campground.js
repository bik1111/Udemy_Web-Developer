const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;



//https://res.cloudinary.com/dorrgo67l/image/upload/w_300/v1661247793/YelpCamp/wknqgcaon0ydslx9o4f0.jpg


const opts = {toJSON: { virtuals: true } };


const ImageSchema = new Schema({
    
        url: String, 
        filename: String
    
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})


const CampgroundSchema = new Schema({
    title: String,
    images : [ImageSchema],
    geometry: {
        type: {
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author : {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
         type: Schema.Types.ObjectId,   
         ref: 'Review'
        }
    ]
  
}, opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    //this : 캠핑장 인스턴스 
    return `<a href="/campgrounds/${this._id}">${this.title}</a>
    <p>${this.description.substring(0,20)}...</p>`

})


//finoOneAndDelet 하고 남은 리뷰들 삭제하기.
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
    //캠핑장을 제거하고 그 캠핑장에 기록된 남은 리뷰들(reviews)이 있으면, 
    //각각의 리뷰의 아이디를 조회해 삭제한다(remove)
     await Review.remove({_id : {$in : doc.reviews} })

    }
})

//데이터 내보내기 (기본 모델 생성)
module.exports = mongoose.model('Campground', CampgroundSchema);
