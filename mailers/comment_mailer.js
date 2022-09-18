const nodemailer = require("../config/nodemailer")

exports.newComment = (comment) =>{
    console.log("email is "+comment.user.email);
    console.log(comment);
    let htmlfile = nodemailer.renderedTemplate({comment: comment},'new_comment.ejs');
    nodemailer.transporter.sendMail({
        from : 'rohitvish288@gmail.com',
        to: comment.user.email,
        subject : 'Your comment is published',
        html: htmlfile
    }, (err, info) => {
        if(err){console.log("Error sending email "+err); return;}
        console.log("message sent successfully" + info);
    })    
}