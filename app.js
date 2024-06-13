const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const {usermodel}=require("./models/register")
const bcrypt=require("bcryptjs")

const app=express()
app.use(cors())
app.use(express.json())

const generateHashedpswd = async(password)=>{
    const salt = await bcrypt.genSalt(10)//salt is a cost factor
    return bcrypt.hash(password,salt)
}


mongoose.connect("mongodb+srv://shilpa:shilpa123@cluster0.qb2ryzy.mongodb.net/ksrtcDB?retryWrites=true&w=majority&appName=Cluster0")

app.post("/reg",async (req,res)=>{
    let input=req.body
    let hashedpswd=await generateHashedpswd(input.password)
    console.log(hashedpswd)
    input.pass=hashedpswd//this is for getting hashed password in db
    let register=new usermodel(input)
    register.save()
    res.json({"status":"success"})
})


app.listen(8080,()=>{
   console.log("server started")
})