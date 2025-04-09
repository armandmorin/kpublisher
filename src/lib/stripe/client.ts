import Stripe from 'stripe';

// Hardcoded Stripe API key for deployment
// In a production environment, this should be stored securely
const STRIPE_API_KEY = 'sk_test_51OxYzLCRMb5PN61234567890abcdefghijklmnopqrstuvwxyz';

let stripeInstance: Stripe | null = null;

export async function getStripeClient(): Promise<Stripe | null> {
  if (stripeInstance) return stripeInstance;

  try {
    // Create a new Stripe client with the hardcoded API key
    stripeInstance = new Stripe(STRIPE_API_KEY, {
      apiVersion: '2025-03-31.basil', // Use the latest API version
    });
    
    return stripeInstance;
  } catch (error) {
    console.error('Error initializing Stripe client:', error);
    return null;
  }
}

export async function createCheckoutSession(customerId: string, priceId: string, successUrl: string, cancelUrl: string) {
  const stripe = await getStripeClient();
  
  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  
  return session;
}

export async function createCustomer(email: string, name?: string) {
  const stripe = await getStripeClient();
  
  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }
  
  const customer = await stripe.customers.create({
    email,
    name,
  });
  
  return customer;
}

export async function getSubscription(subscriptionId: string) {
  const stripe = await getStripeClient();
  
  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }
  
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const stripe = await getStripeClient();
  
  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }
  
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

export async function createPrice(amount: number, currency: string, interval: 'month' | 'year', productId: string) {
  const stripe = await getStripeClient();
  
  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }
  
  const price = await stripe.prices.create({
    unit_amount: amount,
    currency,
    recurring: { interval },
    product: productId,
  });
  
  return price;
}

export async function createProduct(name: string, description?: string) {
  const stripe = await getStripeClient();
  
  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }
  
  const product = await stripe.products.create({
    name,
    description,
  });
  
  return product;
}

export async function listProducts() {
  const stripe = await getStripeClient();
  
  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }
  
  const products = await stripe.products.list({
    active: true,
    limit: 100,
  });
  
  return products.data;
}

export async function listPrices(productId?: string) {
  const stripe = await getStripeClient();
  
  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }
  
  const params: Stripe.PriceListParams = {
    active: true,
    limit: 100,
  };
  
  if (productId) {
    params.product = productId;
  }
  
  const prices = await stripe.prices.list(params);
  return prices.data;
}
