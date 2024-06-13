const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const {usermodel}=require("./models/register")
const bcrypt=require("bcryptjs")
const jwt =require("jsonwebtoken")//importing token library
const {busmodel}=require("./models/busmodel")

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
    input.password=hashedpswd//this is for getting hashed password in db
    let register=new usermodel(input)
    register.save()
    res.json({"status":"success"})
})

//login api - here we need async as the password is encrypted
app.post("/login",(req,res)=>{
    let input =req.body
    //we are checking with mail id
    usermodel.find({"email":req.body.email}).then(
        (response)=>{
            if(response.length>0)
                {
                    let dbpass =response[0].password
                    console.log(dbpass)
                    bcrypt.compare(input.password,dbpass,(error,isMatch)=>{
                        if (isMatch) {
                            //if login success generate token
                            jwt.sign({email:input.email},"user-app",{expiresIn:"1d"},
                                (error,token)=>{
                                if (error) {
                                    res.json({"status":"unable to create token"})
                                } else {
                                    res.json({"status":"success","userid":response[0]._id,"token":token})
                                }
                            })//blog-app is the name of the token
                        } else {
                            res.json({"status":"incorrect password"})
                        }
                    })
                }
            else{
                res.json({"status":"user not found"})
            }
        }
    )
    })


app.post("/view",(req,res)=>{
        let token=req.headers["token"]
        jwt.verify(token,"user-app",(error,decoded)=>{
            if (error) {
                res.json({"status":"unauthorized access"})
                
            } else {
                if (decoded) {
                    usermodel.find().then(
                        (response)=>{
                            res.json(response)
                        }
                    ).catch()
                    
                }
            }
        })
    })
    


 
app.post("/add",(req,res)=>{
    let input=req.body
    // res.send("success")
    // console.log(input)

    let bus=new busmodel(input)
    // console.log(bus)
    // res.send("model passing success")

    bus.save()

    res.json({"status":"success"})   
   
})   


app.listen(8080,()=>{
   console.log("server started")
})