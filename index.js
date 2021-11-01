require('dotenv').config();
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');


(async () => {

  const locationRequest = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/PK/search?q=${decodeURIComponent('Karachi')}&apikey=${process.env.ACCUWEATHER_API_KEY}`);  
  const [locationData] = await locationRequest.json();
  const locationKey = locationData.Key

  const forecastRequest = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${process.env.ACCUWEATHER_API_KEY}`);  
  const {Headline:{Text:forecastText},DailyForecasts:dailyForecasts} = await forecastRequest.json();

  const temperature = dailyForecasts[0]?.Temperature;

  const gifRequest = await fetch(`https://g.tenor.com/v1/trending?limit=1&contentfilter=low&key=${process.env.TENOR_API_KEY}`)
  const {results} = await gifRequest.json();
  const gifMedia = results[0].media[0].nanogif;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER_EMAIL,
      pass: process.env.MAIL_USER_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Mubashir" ${process.env.MAIL_USER_EMAIL}`,
    to: process.env.MAIL_TO, 
    subject: "Daily Report", // Subject line
    text: `
      Daily Report
    `, // plain text body
    html: `
      <h1>Daily Report</h1>
      <h2>Weather</h2>
      <p>Forecast: <em>${forecastText}</em></p>
      <p>Min: <strong><em>${temperature.Minimum.Value}°${temperature.Minimum.Unit}</em></strong></p>
      <p>Max: <strong><em>${temperature.Maximum.Value}°${temperature.Maximum.Unit}</em></strong></p>
      <p><img src=${gifMedia.url} alt="gif" /></p>
      `, // html body
  });

})();