// Load the express module
const express = require('express');
// Create an instance of express
const app = express();
// Create an instance of a Router
const router = express.Router();
// Specify the port to use for this server
const port = 3010;

// Configure Mustache Templating Engine
let mustacheExpress = require('mustache-express');
// The following is the default.
// Change the directory name if you wish
//app.set('views', `${__dirname}/views`);
// Tell express the view engine you are using
app.set('view engine', 'mustache');
// Set the engine to Mustache
app.engine('mustache', mustacheExpress());

// Load body-parser module
// (required for post-backs)
const bodyParser = require('body-parser')
// Support JSON-encoded form body
app.use(bodyParser.json());
// Support URL-encoded form body
app.use(bodyParser.urlencoded({
    extended: true
}));

// Mount routes from modules
router.use('/product', require('./routes/product'));

// Configure router so all routes have no prefix
app.use('/', router);


// Configure location(s) of static HTML files
app.use(express.static('public'));

/**
 * GET
 * @returns index.html file
 */
app.get('/', (req, res, next) => {
    res.status(200).send();
});

// Create web server to listen on the specified port
let server = app.listen(port, function () {
    console.log(`AdvWorks web server is running on http://localhost:${port}.`);
});
