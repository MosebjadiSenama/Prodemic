export function welcomeEmail(name, verificationLink) {

    return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>

body{

    margin:0;

    padding:0;

    background:#F5F7FB;

    font-family:Arial,Helvetica,sans-serif;

}

.container{

    width:100%;

    padding:40px 0;

}

.card{

    width:600px;

    max-width:90%;

    margin:auto;

    background:#FFFFFF;

    border-radius:18px;

    overflow:hidden;

    box-shadow:0 10px 30px rgba(0,0,0,.08);

}

.header{

    background:#052659;

    color:white;

    padding:35px;

    text-align:center;

}

.logo{

    font-size:30px;

    font-weight:700;

    letter-spacing:1px;

}

.tagline{

    margin-top:8px;

    color:#C1E8FF;

    font-size:15px;

}

.content{

    padding:40px;

    color:#333;

}

.title{

    font-size:28px;

    font-weight:700;

    margin-bottom:20px;

}

.text{

    font-size:16px;

    line-height:28px;

    color:#555;

}

.button{

    display:inline-block;

    margin-top:35px;

    background:#5483B3;

    color:white !important;

    text-decoration:none;

    padding:16px 34px;

    border-radius:10px;

    font-size:16px;

    font-weight:bold;

}

.section{

    margin-top:40px;

}

.feature{

    background:#F8FAFC;

    border:1px solid #E7ECF2;

    border-radius:12px;

    padding:18px;

    margin-bottom:15px;

}

.feature h3{

    margin:0 0 8px 0;

    color:#052659;

    font-size:17px;

}

.feature p{

    margin:0;

    color:#666;

    line-height:24px;

}

.footer{

    text-align:center;

    padding:25px;

    color:#999;

    font-size:13px;

    border-top:1px solid #EEE;

}

</style>

</head>

<body>

<div class="container">

<div class="card">

<div class="header">

<div class="logo">

PRODEMIC

</div>

<div class="tagline">

Where Academics Meet Productivity

</div>

</div>

<div class="content">

<div class="title">

Welcome ${name} 👋

</div>

<p class="text">

Thank you for creating your Prodemic account.

Before you can start organising your academic life,

please verify your email address.

</p>

<div style="text-align:center;">

<a

href="${verificationLink}"

class="button"

>

Verify Email

</a>

</div>

<div class="section">

<div class="feature">

<h3>📚 Module Management</h3>

<p>

Keep all your university modules organised in one place.

</p>

</div>

<div class="feature">

<h3>📅 Academic Planner</h3>

<p>

Track lectures, assessments and important deadlines.

</p>

</div>

<div class="feature">

<h3>🤖 AI Features</h3>

<p>

Generate study plans and summaries to help you stay productive.

</p>

</div>

</div>

</div>

<div class="footer">

© 2026 Prodemic

<br><br>

Where Academics Meet Productivity

</div>

</div>

</div>

</body>

</html>

`;

}