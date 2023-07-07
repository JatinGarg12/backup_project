const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:568,
    secure:false,
    requireTLS:true,
    auth:{
        user:'jatin.garg.cs.2019@miet.ac.in',
        pass:"Jatin.Garg@9988"
    }
});
let mailOption={
    from:"jatin.garg.cs.2019@miet.ac.in",
    to:"jatin.garg.cs.2019@miet.ac.in",
    subject:"Demo mailer",
    text:"Hello This is DEmo mail"
};
transporter.sendMail(mailOption,(err,data)=>{
    if(err) console.log(err);
    else console.log("Email has been sent");
});