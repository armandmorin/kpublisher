import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getBookCovers, getCurrentUser, deleteBookCover } from '@/lib/supabase/utils';
import { BookCover } from '@/lib/supabase/config';

export default async function CoversPage() {
  // Get the current user
  const user = await getCurrentUser();

  // If no user is found, redirect to login
  if (!user) {
    redirect('/auth/login');
  }

  // Get the user's book covers
  const covers = await getBookCovers(user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cover Gallery</h1>
        <Link
          href="/dashboard/create-cover"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
          Create New Cover
        </Link>
      </div>

      {covers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No covers</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new book cover.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/create-cover"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              Create New Cover
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {covers.map((cover: BookCover) => (
            <CoverCard key={cover.id} cover={cover} />
          ))}
        </div>
      )}
    </div>
  );
}

function CoverCard({ cover }: { cover: BookCover }) {
  // Format the date
  const formattedDate = new Date(cover.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={cover.image_url}
          alt={`Cover generated with prompt: ${cover.prompt}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Created: {formattedDate}</p>
          </div>
          <form action={async () => {
            'use server';
            await deleteBookCover(cover.id);
          }}>
            <button
              type="submit"
              className="text-red-600 hover:text-red-900 text-sm font-medium"
            >
              Delete
            </button>
          </form>
        </div>
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-900">Prompt</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-3">{cover.prompt}</p>
        </div>
        <div className="mt-4 flex justify-between">
          <a
            href={cover.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View Full Size
          </a>
          <a
            href={cover.image_url}
            download
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
