import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema(
    {
        Category:{
            type:String,
            required: true
        },
        Email:{
            type:String,
            unique:true,
            default:undefined,
            index:true
        },
        Phone_no : {
            type: Number,
            unique: true,
            default:undefined,
            index: true
        },
        Name : {
            type: String,
            required: true,
            lowercase:true,
            trim: true
        },
        isactive : {
            type:Boolean,
            required:true
        },
        password:{
            type:String,
            required:[true, 'Password is required']
        },
        refreshToken:{
            type: String
        }
    },{timestamps:true}
)


// Below function is the hook which is functionality given by mongoose

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})  


// Below is the funciton 
userSchema.methods.isPasswordCorrect = async function
(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.Email,
        name:this.Name
    }, 
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
})    
}
userSchema.methods.generateRefreshToken =function(){    
    return jwt.sign({
    _id:this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)}

export const User = mongoose.model("User", userSchema)