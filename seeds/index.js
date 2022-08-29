//이 파일은 데이터베이스에 시드하고 싶을 때 사용 (Node 앱과는 별도로 실행, 데이터나 모델 수정시 사용)
//seeds 폴더에 있는 파일들은 메인 앱과는 무관.
// 데이터베이스를 보고 싶을 때 index.js 파일을 열면됨.const mongoose = require('mongoose');
//cities.js 의 객체 사용하기 위함.
const cities = require('./cities');
const mongoose = require('mongoose')
const { places, descriptors } = require('./seedHelpers');
//campgrund 모델의 객체(Campground) 생성
//seeds 폴더 기준 campground모델이 들어있는 modesl폴더는 두번에 걸쳐 들어가야 하므로 '..' 점 두개 사용
const Campground = require('../models/campground');
//로컬 개발 데이터베이스 또는 프로덕트 환경시 프로덕션 데이터베이스 사용.
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//오류 확인하고 오류 없을시 연결됐다는 문구 출력
//몽구스 연결을 db라는 변수로 나타냄.
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//임의의 장소와 묘사 선택하기
//array[Math.floor(Math.random() * array.length)]
const sample = array => array[Math.floor(Math.random() * array.length)];





//기존 데이터 삭제 (초기화) 하고 새로운 데이터 삽입
const seedDB = async() => {
    //기존의 캠핑장은 삭제.
    await Campground.deleteMany({});
    //랜덤으로 캠핑장 50개 리스트 만들기.
    for(let i=0; i< 200; i++) {
       const random1000 = Math.floor(Math.random() * 1000);
       const price =Math.floor(Math.random() * 20) + 10; 
        // 캠프 객체들 생성하기.
       const camp = new Campground({
            author: '630355b563e61f00f040f291',
            location : `${cities[random1000].city}`,
            state : `${cities[random1000].state}`,
            //' 아름다운 캐년'처럼 형용사 + 명사 조합
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint cum eos sed saepe, totam quo eaque maiores voluptatem mollitia aliquid? Ea consequatur cum repudiandae, totam pariatur voluptatem quia nesciunt ipsam!',
            price,
            geometry: {
                type : "Point", 
                coordinates : [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                    ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dorrgo67l/image/upload/v1661247793/YelpCamp/wknqgcaon0ydslx9o4f0.jpg',
                    filename: 'YelpCamp/wknqgcaon0ydslx9o4f0'

                },
                {
                    url: 'https://res.cloudinary.com/dorrgo67l/image/upload/v1661247793/YelpCamp/wknqgcaon0ydslx9o4f0.jpg',
                    filename: 'YelpCamp/wknqgcaon0ydslx9o4f0'

                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
        mongoose.connection.close();
})