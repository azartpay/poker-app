import router from './controllers/main-router';
import { NextFunction, Response, Request } from 'express';

import express from 'express';
import bodyParser from 'body-parser';

let app        = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    // TODO allow requests just from client or provide OPTIONS requests
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var port = process.env.PORT || 8080;        // set our port

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
