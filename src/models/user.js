import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
    profile: {
        username: String,
        thumbnail: {
            type: String,
            default: '',
        }
    },
    email: String,
    social: {
        google: {
            id: String,
            accessToken: String,
        },
    },
    hashedPassword: String,
})

/*
모델 메서드
.statics : this는 모델 자체를 가리킴(예: findByEmail, findByUsername...)
.methods : this는 데이터 인스턴스
*/

//비밀번호 설정 메서드
UserSchema.methods.setPassword = async function(password){
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
}

//비밀번호 확인 메서드
UserSchema.methods.checkPassword = async function(password){
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;
}

//응답 데이터에서 hashedPassword 필드 제거 메서드
UserSchema.methods.serialize = function(){
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
}

//해당 모델에서 전달된 username이 있는지 찾는 메서드
UserSchema.statics.findByUsername = function(username){
    return this.findOne({ username });//this는 모델을 가리킴 
}

//해당 모델에서 전달된 email 또는 username이 있는지 찾는 메서드
UserSchema.statics.findByEmailOrUsername = function(username, email){
    return this.findOne({
        $or: [
            { 'profile.username': username },
            { email }
        ]
    })
}

const User = mongoose.model('User', UserSchema);
export default User;