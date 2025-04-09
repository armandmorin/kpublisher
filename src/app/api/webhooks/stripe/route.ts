import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase/config';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion, // Use the latest API version
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  
  // Get the Stripe signature from the request headers
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Error handling webhook: ${error.message}`);
    return NextResponse.json(
      { error: `Error handling webhook: ${error.message}` },
      { status: 500 }
    );
  }
}

// Handler functions for different webhook events

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Get the customer ID from the session
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!customerId || !subscriptionId) {
    console.error('Missing customer ID or subscription ID in session');
    return;
  }

  // Get the user ID from the client_reference_id or metadata
  const userId = session.client_reference_id || session.metadata?.userId;

  if (!userId) {
    console.error('Missing user ID in session');
    return;
  }

  // Update the user record with the Stripe customer ID
  const { error: updateError } = await supabase
    .from('users')
    .update({
      stripe_customer_id: customerId,
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating user with Stripe customer ID:', updateError);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  await updateSubscriptionStatus(subscription);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await updateSubscriptionStatus(subscription);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find the user with this Stripe customer ID
  const { data: users, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId);

  if (findError || !users || users.length === 0) {
    console.error('Error finding user with Stripe customer ID:', findError);
    return;
  }

  const userId = users[0].id;

  // Update the user's subscription status
  const { error: updateError } = await supabase
    .from('users')
    .update({
      subscription_status: 'canceled',
      subscription_plan: null,
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating user subscription status:', updateError);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // This is handled by the subscription events, but you could add additional logic here
  console.log('Invoice payment succeeded:', invoice.id);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Find the user with this Stripe customer ID
  const { data: users, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId);

  if (findError || !users || users.length === 0) {
    console.error('Error finding user with Stripe customer ID:', findError);
    return;
  }

  const userId = users[0].id;

  // Update the user's subscription status to past_due
  const { error: updateError } = await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating user subscription status:', updateError);
  }
}

// Helper function to update subscription status
async function updateSubscriptionStatus(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const priceId = subscription.items.data[0].price.id;

  // Find the subscription plan from the price ID
  const { data: plans, error: planError } = await supabase
    .from('subscription_plans')
    .select('interval')
    .eq('stripe_price_id', priceId);

  if (planError || !plans || plans.length === 0) {
    console.error('Error finding subscription plan:', planError);
    return;
  }

  const planInterval = plans[0].interval;

  // Find the user with this Stripe customer ID
  const { data: users, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId);

  if (findError || !users || users.length === 0) {
    console.error('Error finding user with Stripe customer ID:', findError);
    return;
  }

  const userId = users[0].id;

  // Update the user's subscription status
  const { error: updateError } = await supabase
    .from('users')
    .update({
      subscription_status: status,
      subscription_plan: planInterval,
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating user subscription status:', updateError);
  }
}
