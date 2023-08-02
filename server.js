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
  var data = { price: unitAmount };
  // Send the HTML file as a response
  res.render('success_new', { price: data.price });

});

app.listen(3000, () => console.log('Running on port 3000'));
