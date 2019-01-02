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
var data = {
    "Alert Name":"Manoj",
    "Application":"CRM",
    "list" : [
    {
        "email": "abc@example.com",
        "name": "abc",
        "date": "05/01/2015"
    },
    {
        "email": "xyz@example.com",
        "name": "xyz",
        "date": "05/01/2015"
    },
    {
        "email": "xyz@example.com",
        "name": "xyz",
        "date": "05/01/2015"
    },
    {
        "email": "xyz@example.com",
        "name": "xyz",
        "date": "05/01/2015"
    }
]};  
var x={
    data :[
        {
            "qText": "Dirty Wash Jeans",
            "qNum": 15
        },
        {
            "qText": "Lenin Jeansshorts",
            "qNum": 39
        },
        {
            "qText": "Rossi Bermuda Shorts",
            "qNum": 0
        },
        {
            "qText": "Samba Soccer Socks",
            "qNum": 20
        },
        {
            "qText": "Desperado Jeans",
            "qNum": 22
        },
        {
            "qText": "Atles Lussekofta",
            "qNum": 26
        },
        {
            "qText": "Bright Waistband Underwear",
            "qNum": 0
        },
        {
            "qText": "Denim Shirt",
            "qNum": 340
        },
        {
            "qText": "Mr2 Trousers",
            "qNum": 17
        },
        {
            "qText": "Shagall Socks",
            "qNum": 120
        },
        {
            "qText": "Terence Top",
            "qNum": 69
        },
        {
            "qText": "Rossi Shorts",
            "qNum": 53
        },
        {
            "qText": "Jack Flash Dress",
            "qNum": 30
        },
        {
            "qText": "Sumi Underwear",
            "qNum": 39
        },
        {
            "qText": "Chantell Shirt",
            "qNum": 13
        },
        {
            "qText": "Le Baby Dress",
            "qNum": 17
        },
        {
            "qText": "Okkaba Skin Jackets",
            "qNum": 27
        },
        {
            "qText": "Tuxedo Top",
            "qNum": 6
        },
        {
            "qText": "Oyaki Kimono",
            "qNum": 14
        },
        {
            "qText": "Wrap Skirt",
            "qNum": 32
        },
        {
            "qText": "Langoste Shirt",
            "qNum": 4
        },
        {
            "qText": "Minnki Pälsii",
            "qNum": 52
        },
        {
            "qText": "Stretch Pants",
            "qNum": 76
        },
        
       
        {
            "qText": "Baby Dark Lounge Suit",
            "qNum": 10
        },
      
        {
            "qText": "-",
            "qNum": 0
        }
    ]

}  
var template1 = hogan.compile("Hi,<br>"+
"<table border=1><tr><th>Field</th><th>Value<th></tr>{{#data}}<tr><td> {{qText}}</td><td> {{qNum}} </td>{{/data}}"); 
//compiledTemplate=template1.render(data); 

var mailOptions = {
    from: 'ping.admin@roxai.com',
    to:  'manoj.shinde@roxai.com',
    subject: 'Alert Created Successfully..',
    html: template1.render(x,template)
};

transporter.sendMail(mailOptions, function(error, info){
if (error) {
    console.log(error);
} else {
    console.log('Email sent: ' + info.response);
}
}); 


