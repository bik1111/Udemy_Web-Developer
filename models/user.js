const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//스키마에 사용자 이름, 암호필드 추가.
//사용자 이름 중복여부 확인 , 부가적인 메소드 추가
//해쉬,솔트 필드와 솔트 값 추가.
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);