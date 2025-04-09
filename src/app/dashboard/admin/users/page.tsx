import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/utils';
import { supabase } from '@/lib/supabase/config';
import type { User } from '@/lib/supabase/config';

export default async function UsersPage() {
  // Get the current user
  const user = await getCurrentUser();

  // If no user is found or user is not an admin, redirect
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  // Get all users
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            All Users
          </h3>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {users?.length || 0} users
          </span>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subscription
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users?.map((user: User) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserRow({ user }: { user: User }) {
  // Format the date
  const formattedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Format subscription status
  const subscriptionStatus = user.subscription_status
    ? user.subscription_status.charAt(0).toUpperCase() +
      user.subscription_status.slice(1)
    : 'None';

  // Format subscription plan
  const subscriptionPlan = user.subscription_plan
    ? user.subscription_plan.charAt(0).toUpperCase() +
      user.subscription_plan.slice(1)
    : 'None';

  // Determine subscription badge color
  let badgeColor = 'bg-gray-100 text-gray-800';
  if (user.subscription_status === 'active') {
    badgeColor = 'bg-green-100 text-green-800';
  } else if (user.subscription_status === 'trialing') {
    badgeColor = 'bg-blue-100 text-blue-800';
  } else if (
    user.subscription_status === 'past_due' ||
    user.subscription_status === 'unpaid'
  ) {
    badgeColor = 'bg-red-100 text-red-800';
  }

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{user.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === 'admin'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}
          >
            {subscriptionStatus}
          </span>
          <span className="text-xs text-gray-500 mt-1">{subscriptionPlan}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formattedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <form
          action={async (formData: FormData) => {
            'use server';
            const role = formData.get('role') as string;
            await supabase
              .from('users')
              .update({ role })
              .eq('id', user.id);
          }}
          className="flex items-center space-x-2"
        >
          <select
            name="role"
            defaultValue={user.role}
            className="block w-24 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update
          </button>
        </form>
      </td>
    </tr>
  );
}
