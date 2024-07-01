// Create an instance of a Router
const router = require('express').Router();

// Load tiny-json-http module
const tiny = require('tiny-json-http');

// Create URL for Web API calls
const url = 'http://localhost:3000/api/product';

// GET /product Route
router.get('/', async (req, res, next) => {
    
    
    try {
        // Request data from Web API
        let response = await tiny.get({
            "url": url
        });
        // Get data from response
        let data = response.body.data;

        // Render the page
        res.render('product',
        {
            "isListVisible": true,
            "data": data,
            "costAsCurrency": function () {
                return new Number(this.standardCost).toLocaleString("en-US",
                    { "style": "currency", "currency": "USD" });
            },
            "priceAsCurrency": function () {
                return new Number(this.listPrice).toLocaleString("en-US",
                    { "style": "currency", "currency": "USD" });
            }
        });
    } catch (err) {
        next(err);
    }
});

// GET /search Route
router.get('/search', async (req, res, next) => {
    try {
        // Create search object with parameters from query line    
        let search = {
            "name": req.query.searchName, 
            "listPrice": req.query.searchListPrice
        };
        if (search.name || search.listPrice) {
            let request = url;
            if (search.name && search.listPrice) {
                request += `/search?name=${search.name}&listPrice=${search.listPrice}`;
            }
            if (search.name && !search.listPrice) {
                request += `/search?name=${search.name}`;
            }
            if (!search.name && !search.listPrice) {
                request += `/search?listPrice=${search.listPrice}`;
            }

            // Request data from Web API
            let response = await tiny.get({"url": request});
            // Get data from response
            let data = response.body.data;
            // Render the page
            res.render('product',
            {
                "isListVisible": true,
                "search": search,
                "data": data,
                "costAsCurrency": function () {
                    return new Number(this.standardCost).toLocaleString("en-US",
                    { "style": "currency", "currency": "USD" });
                },
                "priceAsCurrency": function () {
                    return new Number(this.listPrice).toLocaleString("en-US",
                    { "style": "currency", "currency": "USD" });
                }
            });
        }
        else {
                // Redisplay the list
                res.redirect('/product');
            }
    } catch (err) {
        next(err);
    }
});

router.get('/add', async (req, res, next) => {
    try {
        res.render('product', 
            {
                "isListVisible": false,
                "isAdding": true,
                "detail": {
                    "name": "",
                    "productNumber": "",
                    "color": "Red",
                    "standardCost": 1,
                    "listPrice": 2
                }
            }
        );
    } catch (err) {
        next(err);
    }
});
// GET /id Route
router.get('/:id', async (req, res, next) => {
    try {
        // Build the request URL
        let request = url + `/${req.params.id}`;
        // Request data from Web API
        let response = await tiny.get({"url": request});
        // Get data from response
        let data = response.body.data;
        // Render the page
        res.render('product',
        {
            "isListVisible": false,
            "isAdding": false,
            "detail": data
        }
        );
    } catch (err) {
        next(err);
    }
});

// POST from Detail
router.post('/', async (req, res, next) => {
    try {
        // Declare the response object
        let response = {};
        // Get posted values from form
        let product = req.body;
        if (product.isAdding != 'false') {
            // POST a new product
            response = await tiny.post({
                "url": url,
                "data": product
            });
        }
        else {
            let request = url + `/${product.productID}`;
            // PUT an updated product
            response = await tiny.put({
                "url": request,
                "data": product
            });
        }
        // TODO: Handle a 404 or a 400

        // Redisplay the list
        res.redirect('/product');
    } catch (err) {
        next(err);
    }
});

// GET /delete/id Route
router.get('/delete/:id', async (req, res, next) => {
    try {
        // Build the request URL
        let request = url + `/${req.params.id}`;
        // Request data from Web API
        response = await tiny.delete({"url": request});
        // TODO: handle 404

        // Redisplay the list
        res.redirect('/product');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
