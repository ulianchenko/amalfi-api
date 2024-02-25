import express, { Request, Response } from 'express';
import axios from 'axios';
import Stripe from 'stripe';
import config from 'config';

const router = express.Router({ mergeParams: true });

const stripeObj = new Stripe(process.env.STRIPE_KEY as string);
const DOMAIN_NAME = config.get('DOMAIN_NAME');

// Moneris payment routes
router.post('/moneris-ticket', async (req: Request, res: Response): Promise<void> => {
  axios.post('https://gatewayt.moneris.com/chkt/request/request.php', req.body)
  .then(response => {
    res.status(201).json(response.data.response.ticket);
  })
  .catch(error => {
    console.log('moneris create ticket error', error);
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  });
});

router.post('/moneris-receipt', async (req: Request, res: Response): Promise<void> => {
  axios.post('https://gatewayt.moneris.com/chkt/request/request.php', req.body)
  .then(response => {
    res.status(201).json(response.data.response);
  })
  .catch(error => {
    console.log('moneris create receipt error', error);
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  });
});

// Stripe payment routes
router.post('/create-checkout-session', async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    console.log('stripe payment error: ', error);
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

export default router;
