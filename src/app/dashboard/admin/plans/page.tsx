import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/utils';
import { supabase } from '@/lib/supabase/config';

// Define the plan type
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  active: boolean;
  stripe_price_id: string;
  created_at: string;
  updated_at: string;
}

export default async function PlansPage() {
  // Get the current user
  const user = await getCurrentUser();

  // If no user is found or user is not an admin, redirect
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  // Get all plans
  const { data: plans, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching plans:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            // This would open a modal or navigate to a create plan page
            // For now, we'll just show an alert
            alert('Create plan functionality would go here');
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Plan
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            All Plans
          </h3>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {plans?.length || 0} plans
          </span>
        </div>
        <div className="border-t border-gray-200">
          {plans && plans.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
              {plans.map((plan: Plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No plans</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new subscription plan.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    // This would open a modal or navigate to a create plan page
                    alert('Create plan functionality would go here');
                  }}
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create New Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Stripe Integration
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Connect your Stripe account to manage subscriptions.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Stripe Configuration
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Ensure your Stripe API keys are properly configured in the API Keys
                  section.
                </p>
              </div>
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
              <a
                href="/dashboard/admin/api-keys"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Configure API Keys
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  // Format the price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(plan.price / 100);

  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg border ${plan.active ? 'border-green-500' : 'border-gray-200'}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {plan.name}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              plan.active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {plan.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="mt-2">
          <p className="text-3xl font-extrabold text-gray-900">
            {formattedPrice}
            <span className="text-base font-medium text-gray-500">
              /{plan.interval}
            </span>
          </p>
          <p className="mt-3 text-sm text-gray-500">{plan.description}</p>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Features</h4>
          <ul className="mt-2 space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2 text-sm text-gray-500">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
        <button
          type="button"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            // This would open a modal or navigate to an edit plan page
            alert(`Edit plan ${plan.name}`);
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm ${
            plan.active
              ? 'text-red-700 bg-red-100 hover:bg-red-200'
              : 'text-green-700 bg-green-100 hover:bg-green-200'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          onClick={() => {
            // This would toggle the plan's active status
            alert(`${plan.active ? 'Deactivate' : 'Activate'} plan ${plan.name}`);
          }}
        >
          {plan.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}
