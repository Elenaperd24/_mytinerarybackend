const User = require("../models/user.js")
const bcryptjs = require("bcryptjs")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")


async function sendEmail(email, uniqueString) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "elena.study2022@gmail.com",
            pass: process.env.NODEMAILER
        }
    })
    const sender = "elena.study2022@gmail.com"
    const mailOptions = {
        from: sender,
        to: email,
        subject: "User verification",
        html:`<div  style="width: 400px; height: 200px; margin-left: 20%;">
            <div style="width: 100%; height:100%; background-color: #fff5ee;">
                  <h2 style="font-size: 30px;text-align: center;  color: #ff4b4b; font-weight: 800;">EMAIL VALIDATION</h2>
                  <h2 style="font-size: 20px;text-align: center;  color: rgb(99, 99, 99); font-weight: 100;">Let's travel The World</h2>
                  <a href=https://mytinerary-elena.herokuapp.com/api/verify/${uniqueString} style=" color: rgb(255, 85, 0); font-size: 20px;text-align: center; text-decoration: none;margin-left: 35%; font-weight: 700;">Click Here</a>
                 <h1 style="font-size: 10px ; text-align: center; color:#ff4b4a; font-family:Permanent Marker;font-weight: 800">My Tinerary</h1>
            </div>
            </div>`
        /* 
        html: `<div style"background-color:"red">Press <a href=https://mytinerary-elena.herokuapp.com/api/verify/${uniqueString}>
        here</a>Para validar tu email
        </div>` */
    }
    await transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error)
        }
        else {
            console.log("Message sent");
        }
    })

}

const userControllers = {

    verifyEmail: async (req, res) => {
        const { uniqueString } = req.params
        const user = await User.findOne({ uniqueString: uniqueString })
        if (user) {
            user.emailVerified = true
            await user.save()
            res.redirect("https://mytinerary-elena.herokuapp.com/api/signin")
        }
        else {
            res.json({ success: false, response: "your email couldn't be verified" })
        }
    },
    nuevoUsuario: async (req, res) => {
        const { img, name, lastName, email, password, from } = req.body.NuevoUsuario // destructurar agarramos un objeto y sus variables las podemos trabajar por separado
        console.log(req.body)
        try {
            const usuarioExiste = await User.findOne({ email })
            if (usuarioExiste) {                
                if (from!=="MyTineray" ) {
                    const passwordHash = bcryptjs.hashSync(password, 10)
                    usuarioExiste.img= img
                    usuarioExiste.password = passwordHash;
                    usuarioExiste.emailVerified = true
                    usuarioExiste.from = from
                    usuarioExiste.connected = false

                    usuarioExiste.save()
                    res.json({ success: true, from: from, response: "We update your signin so you can do it with  " + from })
                }
                else {
                    res.json({ success: false, from: "SignUp", response: "This email is already in use, perform SignIn" })
                }
            }
            else {
                const emailVerified = false
                const uniqueString = crypto.randomBytes(15).toString("hex")
                const passwordHash = bcryptjs.hashSync(password, 10)
                const newUser = new User({
                    img,
                    name,
                    lastName,
                    email,
                    password: passwordHash,
                    uniqueString,
                    emailVerified,
                    connected: false,
                    from
                })
                console.log("user condicional no existe usuario")

                console.log(newUser);

                if (from!=="MyTineray") {
                    newUser.emailVerified = true
                        newUser.google = true
                        newUser.connected = false
                        await newUser.save()
                    res.json({ success: true, from: from, response: "Congratulations we have created your user with  " + from, data: { newUser } })
                }

                else {
                    newUser.emailVerified = false
                    newUser.google = false
                    newUser.connected = false
                    await newUser.save()
                    await sendEmail(email, uniqueString)
                    res.json({ success: true, from: "SignUp", response: "We have sent an email to your email", data: { newUser } })
                }
            }
        }
        catch (error) { res.json({ success: false, from: "SignUp", response: null, error: error }) }
    },

    accesUser: async (req, res) => {
        const { email, password } = req.body.UserData

        try {
            const user = await User.findOne({ email })

            if (!user) {
                res.json({ success: false, from: "controller", error: "user or password are incorrect" })
            }
            else {
                if (user.emailVerified) {
                    let passwordCoincide = bcryptjs.compareSync(password, user.password)

                    if (passwordCoincide) {
                        const datosUser = {
                            img:user.img,
                            name: user.name,
                            lastName: user.lastName,
                            email: user.email,
                            connected: user.connected,
                            id: user._id,
                            from:user.from
                        }
                        user.connected = true
                        await user.save()
                        const token = jwt.sign({ ...datosUser }, process.env.SECRETKEY,{expiresIn:60*60*24})
                        res.json({ success: true, from: "controller", response: { token, datosUser } })
                    }
                    else {
                        res.json({ success: false, from: "controller", error: "user or password are incorret" })
                    }
                }
                else {
                    res.json({ success: false, from: "controller", error: "verify your email or password" })
                }
            }
        }
        catch (error) { 
            console.log(error); res.json({ success: false, response: null, error: error })
        }
    },
    cerrarSesion: async (req, res) => {
        const email = req.body.email
        const user = await User.findOne({ email })
        user.connected = false
        await user.save()
        res.json({ success: true, response: "Log Out" })
    },
    verifyToken: async(req,res) =>{
        if(!req.error){
            res.json({success:true, 
                datosUser:
                {img:req.user.img,
                name:req.user.name, 
                lastName: req.user.lastName,
                email: req.user.email, 
                connected:req.user.connected , 
                id:req.user.id},
                response:"Welcome Back Again "+req.user.name})
        }
        else{
            res.json({success:false, response:"Sesion vencida, inicia sesion de nuevo"})
        }
    }
}


module.exports = userControllers