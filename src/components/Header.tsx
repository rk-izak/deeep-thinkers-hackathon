import { useState } from 'react';
import { Brain, Menu, X, User, LogOut } from 'lucide-react';
import { useUser, useClerk, SignInButton } from '@clerk/clerk-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8" />
            <span className="text-xl font-semibold">Deep Thinkers</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Services
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </a>
            {isSignedIn && (
              <>
                <a href="#dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </a>
                <a href="#api-docs" className="text-gray-700 hover:text-blue-600 transition-colors">
                  API Docs
                </a>
              </>
            )}

            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <User size={16} />
                  <span className="text-gray-700">
                    {user?.fullName || user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
                  Login
                </button>
              </SignInButton>
            )}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </a>
              <a href="#services" className="text-gray-700 hover:text-blue-600">
                Services
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </a>
              {isSignedIn && (
                <>
                  <a href="#dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </a>
                  <a href="#api-docs" className="text-gray-700 hover:text-blue-600">
                    API Docs
                  </a>
                </>
              )}

              {isSignedIn ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm">
                    <User size={16} />
                    <span className="text-gray-700">
                      {user?.fullName || user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 w-fit"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 w-fit">
                    Login
                  </button>
                </SignInButton>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
