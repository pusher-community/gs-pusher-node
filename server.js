var Pusher = require('pusher');
var express = require('express');
var ejs = require('ejs');

// parse incoming POST requests onto body.{value}
var bodyParser = require('body-parser');

var config = {
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  encrypted: true // use HTTPS
};

// Create a new Pusher instance.
var pusher = new Pusher(config);

var app = express();
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'));

// Make the Pusher App Key available to all templates
app.locals = {
  pusher_app_key: config.key
};

/**
 * Show the list of examples.
 */
app.get('/', function(req, res) {
  res.render('index');
});

/**
 * Serve up the example pages.
 */
app.get('/examples/:name', function(req, res) {
  res.render(req.params.name);
});

/**
 * Called via the Trigger example.
 * Shows triggering an event via Pusher.
 */
app.post('/trigger', function(req, res) {
  var messageText = req.body.message;
  
  /*
  TODO: implement checks to determine if the user is:
  1. Authenticated with the app
  2. Allowed to trigger on the channel
  3. Sanitize any additional data that has been recieved and is to be used

  If so, proceed...
  */
  
  var eventData = {
    message: messageText
  };
  pusher.trigger('my-channel', 'my-event', eventData);
  
  res.send('OK');
});

/**
 * An example of authentication endpoint that handles private channel
 * subscription authentication requests.
 */
app.post('/private_auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channelName = req.body.channel_name;
  
  /*
  TODO: implement checks to determine if the user is:
  1. Authenticated with the app
  2. Allowed to subscribe to the `channelName`
  3. Sanitize any additional data that has been recieved and is to be used

  If so, proceed...
  */
  
  var auth = pusher.authenticate(socketId, channelName);
  res.json(auth);
});

/**
 * An example of authentication endpoint that handles presence channel
 * subscription authentication requests.
 */
app.post('/presence_auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channelName = req.body.channel_name;
  
  /*
  TODO: implement checks to determine if the user is:
  1. Authenticated with the app
  2. Allowed to subscribe to the `channelName`
  3. Sanitize any additional data that has been recieved and is to be used

  If so, proceed...
  */
  
  /*
  Hard-coded channel data for the example.
  In a real application this would be generated based the on the current app user.
  */
  var channelData = {
    // Should uniquely identify the user
    user_id: 'user_' + require('crypto').randomBytes(5).toString('hex'),
    // Additional user information
    user_info: {
      website: 'https://pusher.com',
      company: 'Pusher',
      job_title: 'Head of Developer Relations',
      is_active: true,
      email: 'phil@pusher.com'
    }
  };
  
  var auth = pusher.authenticate(socketId, channelName, channelData);
  res.json(auth);
});

app.post('/webhook', function(req, res) {
  var webhook = pusher.webhook(req);
  
  // will check only the key and secret assigned to the pusher object:
  console.log(webhook.isValid());
  
  res.send('OK');
});

var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;

  console.log('Example app listening at http://localhost:%s', port);
});
