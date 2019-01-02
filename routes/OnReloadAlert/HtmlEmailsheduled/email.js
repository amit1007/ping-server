//For Created Alert 
var nodemailer = require('nodemailer'); 
var hogan = require('hogan.js');
var fs = require('fs');
var template = fs.readFileSync('./Filter.hjs','utf-8');
var compiledTemplate = hogan.compile(template);

var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ping.admin@roxai.com',
            pass: 'Roxai@123'
        }
});
var data = { hostname: 'https://ec2-34-195-43-80.compute-1.amazonaws.com',
     appid: '87903735-db37-4206-b143-455f4d2d55b3',
     diamention: 'Country' } 

var template1 = hogan.compile("Goto qlik-sense App,<br>"+"{{hostname}}/sense/app/{{appid}}/option/clearselection/select/{{diamention}} "); 
//compiledTemplate=template1.render(data); 

var mailOptions = {
    from: 'ping.admin@roxai.com',
    to:  'sheshadri.shete@roxai.com',
    subject: 'url test..',
    html: template1.render(data)
};

transporter.sendMail(mailOptions, function(error, info){
if (error) {
    console.log(error);
} else {
    console.log('Email sent: ' + info.response);
}
}); 


