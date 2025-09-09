'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { Vote, Users, BarChart3, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Create & Share Polls Easily
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Make decisions together. Create polls, gather opinions, and see results in real-time.
            </p>
            <div className="space-x-4">
              {user ? (
                <Link href="/polls/create">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Create Your First Poll
                    <Plus className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Link href="/polls">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Browse Polls
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose Polly?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Simple, fast, and powerful polling platform for everyone
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Vote className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Voting</h3>
                <p className="text-gray-600">
                  Simple and intuitive interface for creating and participating in polls
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
                <p className="text-gray-600">
                  See poll results update in real-time as votes come in
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Anywhere</h3>
                <p className="text-gray-600">
                  Share your polls easily with friends, colleagues, or the public
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Polls Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Recent Public Polls</h2>
              <p className="text-gray-600">
                Join the conversation and make your voice heard
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-gray-500 mb-8">
                No polls available yet. Be the first to create one!
              </p>
              {user ? (
                <Link href="/polls/create">
                  <Button>
                    Create First Poll
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button>
                    Sign Up to Create Polls
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="bg-blue-600 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8">
                Join thousands of users creating and sharing polls
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
