import mongoose from "mongoose"

const loginLogsSchema = new mongoose.Schema({
    user_id:{type:String, required:true},
    login_time:{type:timestamp, required:true},
    logout_time:{type:timestamp, required:true}
},{timestamp:true})

export const loginLogs = mongoose.model("LoginLog", loginLogsSchema)