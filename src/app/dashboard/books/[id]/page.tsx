import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getBookById, getCurrentUser } from '@/lib/supabase/utils';
import { WysiwygEditor } from '@/components/editor/wysiwyg-editor';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function BookPage({ params }: PageProps) {
  // Get the current user
  const user = await getCurrentUser();

  // If no user is found, redirect to login
  if (!user) {
    redirect('/auth/login');
  }

  // Get the book
  const book = await getBookById(params.id);

  // If book not found or doesn't belong to the user
  if (!book || book.user_id !== user.id) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Book not found</h3>
          </div>
        </div>
      </div>
    );
  }

  // Format the date
  const formattedDate = new Date(book.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{book.title}</h1>
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/books/${book.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </Link>
          <Link
            href="/dashboard/books"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Books
          </Link>
        </div>
      </div>

      <div className="text-sm text-gray-500">Last updated: {formattedDate}</div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <WysiwygEditor
            initialContent={book.content}
            readOnly={true}
            title={book.title}
          />
        </div>
      </div>
    </div>
  );
}
