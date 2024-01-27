import express, { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';
import config from 'config';
import dotenv from 'dotenv';
import Stripe from 'stripe';
// import  mongoose, { Document, Model, Schema, model } from 'mongoose';

// import swaggerUi from 'swagger-ui-express';
// Database
import initDatabase from './db/initDatabase';
// Routes
import routes from './routes'
// // Swagger
// import swaggerSpec from './configs/swagerSpec'

const app = express();
dotenv.config();
const PORT = process.env.PORT || config.get('port') || 8080;
// const PORT: number = 8080;
const stripeObj = new Stripe('sk_test_51OWkH4GKmalhlFM413SZO0W54WMJKhMYB1lRE7eNRyzHFsR3SriI1rGRVwVhLRcvnKF2A9KSHABfL0fHIvR7zjXc00ii850ogO');
// const DOMAIN_NAME = 'http://localhost:3000';
// const DOMAIN_NAME = 'https://amalfi.vercel.app';
const DOMAIN_NAME = 'https://amalfi.onrender.com';

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
app.post('/api/create-checkout-session', async (req: Request, res: Response): Promise<void> => {
  const session = await stripeObj.checkout.sessions.create({
    // ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1OX4MIGKmalhlFM45nyYlosE',
        quantity: 1,
      },
    ],
    mode: 'payment',
    // return_url: `${DOMAIN_NAME}/return?session_id={CHECKOUT_SESSION_ID}`,
    // success_url: `${DOMAIN_NAME}?success=true`,
    success_url: `${DOMAIN_NAME}/return?success=true`,
    cancel_url: `${DOMAIN_NAME}/return?canceled=true`,
  });

  // res.send({clientSecret: session.client_secret});
  res.redirect(303, String(session.url));
});

// app.get('/session-status', async (req: Request, res: Response): Promise<void> => {
//   const sessionId = String(req.query.session_id);
//   const session = await stripeObj.checkout.sessions.retrieve(sessionId);

//   res.send({
//     status: session.status,
//     customer_email: session?.customer_details?.email
//   });
// });


// Moneris payment routes
app.post('/api/moneris-ticket', async (req: Request, res: Response): Promise<void> => {
  axios.post('https://gatewayt.moneris.com/chkt/request/request.php', req.body)
  .then(response => {
    res.status(201).json(response.data.response.ticket);
  })
  .catch(error => {
    console.log(error);
  });
});

app.post('/api/moneris-receipt', async (req: Request, res: Response): Promise<void> => {
  axios.post('https://gatewayt.moneris.com/chkt/request/request.php', req.body)
  .then(response => {
    res.status(201).json(response.data.response);
  })
  .catch(error => {
    console.log(error);
  });
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
