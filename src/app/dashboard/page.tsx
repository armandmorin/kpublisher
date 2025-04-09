import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/utils";
import { getBooks, getBookCovers } from "@/lib/supabase/utils";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  // Get the current user
  const user = await getCurrentUser();
  
  if (!user) {
    return null; // This should be handled by the layout
  }
  
  // Get user's books and covers
  const books = await getBooks(user.id);
  const covers = await getBookCovers(user.id);
  
  // Calculate stats
  const totalBooks = books.length;
  const totalCovers = covers.length;
  const recentBooks = books.slice(0, 3); // Get 3 most recent books
  const recentCovers = covers.slice(0, 3); // Get 3 most recent covers
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to your KPublisher dashboard.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">Total Books</h3>
            <div className="text-2xl font-bold">{totalBooks}</div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">Total Covers</h3>
            <div className="text-2xl font-bold">{totalCovers}</div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">Subscription</h3>
            <div className="text-2xl font-bold">
              {user.subscription_plan ? 
                `${user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1)}` : 
                "Free"}
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <div className="text-2xl font-bold">
              {user.subscription_status ? 
                `${user.subscription_status.charAt(0).toUpperCase() + user.subscription_status.slice(1)}` : 
                "Active"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold">Create New Content</h3>
          </div>
          <div className="p-6 pt-0 grid gap-4 md:grid-cols-2">
            <Link href="/dashboard/create-book">
              <Button className="w-full">Create Book</Button>
            </Link>
            <Link href="/dashboard/create-cover">
              <Button className="w-full" variant="outline">Create Cover</Button>
            </Link>
          </div>
        </div>
        
        {user.role === "admin" && (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold">Admin Actions</h3>
            </div>
            <div className="p-6 pt-0 grid gap-4 md:grid-cols-2">
              <Link href="/dashboard/admin/api-keys">
                <Button className="w-full" variant="outline">Manage API Keys</Button>
              </Link>
              <Link href="/dashboard/admin/users">
                <Button className="w-full" variant="outline">Manage Users</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Recent content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent books */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold">Recent Books</h3>
          </div>
          <div className="p-6 pt-0">
            {recentBooks.length > 0 ? (
              <div className="space-y-4">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(book.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/dashboard/books/${book.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No books created yet.</p>
            )}
            
            {totalBooks > 0 && (
              <div className="mt-4">
                <Link href="/dashboard/books">
                  <Button variant="outline" size="sm" className="w-full">View All Books</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent covers */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold">Recent Covers</h3>
          </div>
          <div className="p-6 pt-0">
            {recentCovers.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {recentCovers.map((cover) => (
                  <div key={cover.id} className="aspect-[2/3] relative rounded-md overflow-hidden">
                    <img 
                      src={cover.image_url} 
                      alt="Book cover" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No covers created yet.</p>
            )}
            
            {totalCovers > 0 && (
              <div className="mt-4">
                <Link href="/dashboard/covers">
                  <Button variant="outline" size="sm" className="w-full">View All Covers</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
