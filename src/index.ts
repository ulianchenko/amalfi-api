import express, { NextFunction, Request, Response } from 'express';
// @ts-ignore
import OAuthClient from 'intuit-oauth';
// import axios from 'axios';
import cors from 'cors';
import config from 'config';
import dotenv from 'dotenv';
// import Stripe from 'stripe';
// import  mongoose, { Document, Model, Schema, model } from 'mongoose';

// import swaggerUi from 'swagger-ui-express';
// Database
import initDatabase from './db/initDatabase';
// Routes
import routes from './routes'
import invoiceRequestBody from './db/mockData/invoice.json';
// // Swagger
// import swaggerSpec from './configs/swagerSpec'

const app = express();
dotenv.config();
const PORT = config.get('PORT') || 8080;
// const PORT: number = 8080;
// const stripeObj = new Stripe('sk_test_51OWkH4GKmalhlFM413SZO0W54WMJKhMYB1lRE7eNRyzHFsR3SriI1rGRVwVhLRcvnKF2A9KSHABfL0fHIvR7zjXc00ii850ogO');
// const DOMAIN_NAME = 'http://localhost:3000';
// const DOMAIN_NAME = 'https://amalfi.vercel.app';
// const DOMAIN_NAME = 'https://amalfi.onrender.com';

initDatabase();

// // Serve Swagger UI at /api-docs
// app.use('/api-docs',
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec)
// );

app.use(express.json());
app.use(cors());

app.use('/api', routes);

// // Route for the root URL
// app.get('/', (req: Request, res: Response): void => {
//   res.send('Hello World!');
// });

// Stripe payment routes
// app.post('/api/create-checkout-session', async (req: Request, res: Response): Promise<void> => {
//   const session = await stripeObj.checkout.sessions.create({
//     // ui_mode: 'embedded',
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: 'price_1OX4MIGKmalhlFM45nyYlosE',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     // return_url: `${DOMAIN_NAME}/return?session_id={CHECKOUT_SESSION_ID}`,
//     // success_url: `${DOMAIN_NAME}?success=true`,
//     success_url: `${DOMAIN_NAME}/return?success=true`,
//     cancel_url: `${DOMAIN_NAME}/return?canceled=true`,
//   });

//   // res.send({clientSecret: session.client_secret});
//   res.redirect(303, String(session.url));
// });

// app.get('/session-status', async (req: Request, res: Response): Promise<void> => {
//   const sessionId = String(req.query.session_id);
//   const session = await stripeObj.checkout.sessions.retrieve(sessionId);

//   res.send({
//     status: session.status,
//     customer_email: session?.customer_details?.email
//   });
// });


// Moneris payment routes
// app.post('/api/moneris-ticket', async (req: Request, res: Response): Promise<void> => {
//   axios.post('https://gatewayt.moneris.com/chkt/request/request.php', req.body)
//   .then(response => {
//     res.status(201).json(response.data.response.ticket);
//   })
//   .catch(error => {
//     console.log(error);
//   });
// });

// app.post('/api/moneris-receipt', async (req: Request, res: Response): Promise<void> => {
//   axios.post('https://gatewayt.moneris.com/chkt/request/request.php', req.body)
//   .then(response => {
//     res.status(201).json(response.data.response);
//   })
//   .catch(error => {
//     console.log(error);
//   });
// });

// Routes for quickbooks
let oauthClient: any = null;
let oauth2_token_json = null;
let access_token = '';
let companyId = '';

app.get('/api/quickbooks', (req: Request, res: Response): void => {
  oauthClient = new OAuthClient({
    // clientId: 'AB8EtwqFitQeTQfQtXr9HbCQPoYf4GQAyuIu2fNr33W1FXERXG',
    // clientSecret: 'trPqOVtMm6qpmezBCwxso6npJ947XRGgC5lMmQHg',
    clientId: 'ABVwxZ39lXmAJdAlo4VwehobfXgAAJCsX9n68WlOpJUJMHrd7n',
    clientSecret: 'mgkPADZz5LGpPgNiiq0VCyKFu5Hnw2xi2m5y70hu',
    environment: 'sandbox',
    // redirectUri: 'http://localhost:3000/quickbooksredirect',
    redirectUri: 'https://amalfi.onrender.com/quickbooksredirect',
  });
  const authUri = oauthClient.authorizeUri({scope:[OAuthClient.scopes.Accounting],state:'testState'});

  console.log(authUri);
  res.send(authUri);
});

app.get('/api/quickbooksredirect', (req: Request, res: Response): void => {
  console.log('code: ', req.query.code);
  console.log('realmId: ', req.query.realmId);
  console.log('url: ', req.url);

  companyId = String(req.query.realmId);
  const parseRedirect = req.url;
  oauthClient.createToken(parseRedirect)
    .then(function(authResponse: any) {

      oauth2_token_json = JSON.stringify(authResponse.json, null, 2);
      console.log(oauth2_token_json);
      console.log('access_token: ', JSON.parse(oauth2_token_json).access_token);
      access_token = JSON.parse(oauth2_token_json).access_token;
      // console.log('The Token is  '+ JSON.stringify(authResponse.getJson()));
    })
    .catch(function(e: {originalMessage: string, intuit_tid: string}) {
        console.error("The error message is :"+e.originalMessage);
        console.error(e.intuit_tid);
    });
  // res.redirect('http://localhost:3000/quickbooksredirect');
  res.redirect('https://amalfi.onrender.com/quickbooksredirect');
});

app.get('/api/getInvoiceInfo', function (req, res) {
  // const companyID = oauthClient.getToken().realmId;
  let invoiceBody = invoiceRequestBody;
  if (companyId !== '9341452118612650') {
    console.log('CANADIAN COMPANY CANADIAN COMPANY CANADIAN COMPANY ');
    // @ts-ignore: error message
    invoiceBody.Line[0].SalesItemLineDetail.TaxCodeRef = {
      "name": "SomeTaxName",
      "value": 6
    };
  }

  const url =
    oauthClient.environment == 'sandbox'
      ? OAuthClient.environment.sandbox
      : OAuthClient.environment.production;

  oauthClient
    .makeApiCall({
      url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/invoice?minorversion=62&include=invoiceLink`,
      // url: `${url}v3/company/${companyID}/invoice?minorversion=62&include=invoiceLink`,
      // url: `${url}v3/company/${companyID}/invoice?minorversion=62`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(invoiceRequestBody),
      body: JSON.stringify(invoiceBody),
    })
    .then(function (authResponse: any) {
      // console.log(`\n The response for API call is :${JSON.stringify(authResponse.json)}`);
      console.log(authResponse);
      res.send(authResponse.json);
    })
    .catch(function (e: any) {
      console.error(e);
    });
});

app.get('/api/getCompanyInfo', function (req, res) {
  const companyID = oauthClient.getToken().realmId;

  const url =
    oauthClient.environment == 'sandbox'
      ? OAuthClient.environment.sandbox
      : OAuthClient.environment.production;

  oauthClient
    .makeApiCall({ url: `${url}v3/company/${companyID}/companyinfo/${companyID}` })
    .then(function (authResponse: any) {
      console.log(`\n The response for API call is :${JSON.stringify(authResponse.json)}`);
      res.send(authResponse.json);
    })
    .catch(function (e: any) {
      console.error(e);
    });
});

app.get('/api/quickbookswebhook', (req: Request, res: Response): void => {
  console.log('quickbookswebhook quickbookswebhook quickbookswebhook quickbookswebhook quickbookswebhook quickbookswebhook quickbookswebhook:', req);
});


// Middleware for handling 404 error
app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not Found' });
});

// Middleware for handling 500 error
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
  next();
});

// Start server on port 8080
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
