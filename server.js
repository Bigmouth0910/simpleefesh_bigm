// This is your test secret API key.
// const stripe = require('stripe')('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');      // live key
const stripe = require('stripe')('sk_test_51NXc1kDNINKtzg8u6jK33b5KqOPLsspCx39afdNNX5EyKVVmdeNDpK5Tl5atlx0z5XLCAlqMX33IIRMKNAQsdvmF00IWJKN59b');      // test key
const express = require('express');
const path = require('path');


const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

const YOUR_DOMAIN = 'https://sangria-catfish-hem.cyclic.app';

let unitAmount;
app.get('/create-checkout-session', async (req, res) => {
  // res.send("Hello world");
  unitAmount = parseInt(req.query.data);
  console.log(unitAmount);
  const session = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      // The currency parameter determines which
      // payment methods are used in the Checkout Session.
      currency: 'GBP',
      product_data: {
        name: 'Total_price',
      },
      unit_amount: unitAmount,
    },
    quantity: 1,
  }],

    // unitAmount = session.line_items[0].price_data.unit_amount; // Assign value to the global variable
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get('/mypay', (req, res) => {
  unitAmount = parseInt(req.query.data*100);
  var data = { price: unitAmount };
  // Get the absolute path of the HTML file
  const htmlPath = path.join(__dirname, 'checkout.html');

  // Send the HTML file as a response
  // res.sendFile(htmlPath);
  res.render('checkout', { price: data.price });
});

app.get('/success', (req, res) => {
  // Get the absolute path of the HTML file    
  //var data = { price: unitAmount };
  //const htmlPath = path.join(__dirname, 'success.html');
  // Send the HTML file as a response
  //res.sendFile(htmlPath);
  const html = `
  <!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Landing Page</title>
    <link rel="stylesheet" href="/css/style_new.css">
</head>

<body>
    <!-- Header partial -->

    <section class="hero-section">
        <div class="hero-content">
            <p style="margin-bottom: 0vw;font-size: 200px;color: aliceblue;font-size:10vw;">Success!</p>
            <p class="btn" style="margin-top: -9vw;" onclick="closeWindow()">Close this window to go back!</p>
        </div>
    </section>

    <section class="features-section">
        <div class="container">
            <h2>Our Features</h2>
            <div class="features-grid">
                <div class="feature">
                    <img src="/images/banner/1.jpg" alt="EAT">
                    <h3>EAT</h3>
                </div>
                <div class="feature">
                    <img src="/images/banner/bg-2.jpg" alt="FFRESH">
                    <h3>FRESH</h3>
                </div>
                <div class="feature">
                    <img src="/images/banner/slider-3.jpg" alt="VEGETABLES!">
                    <h3 style="font-size: 24px;">BE HEALTHY!</h3>
                </div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <h2>Get Started Today</h2>
        </div>
    </section>

    <!-- Footer partial -->

    <script src="/js/script.js"></script>
    <script>
      function closeWindow() {
        const popup = window.open('', '_self');
        popup.close();
      }
    </script>
</body>

</html>
  `;
res.send(html);
});

app.listen(3000, () => console.log('Running on port 3000'));
