
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   Menu,
//   X,
//   ShoppingBag,
//   Home,
//   Box,
//   LogIn,
//   LogOut,
//   User,
//   DollarSign,
// } from "lucide-react";

// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../../src/features/auth/authSlice";
// import { API_CONFIG } from "../../src/config/api";

// const navItems = [
//   { name: "Home", href: "/", icon: Home },
//   { name: "Products", href: "/products", icon: Box },
//   { name: "Analytics", href: "/analytics", icon: DollarSign },
// ];

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const router = useRouter();

//   // Get user from Redux state
//   const user = useSelector(selectCurrentUser);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   const handleLogout = async () => {
//     try {
//       await fetch(API_CONFIG.getURL(API_CONFIG.endpoints.auth.logout), {
//         method: "POST",
//         credentials: "include",
//       });
      
//       // Redirect to login after logout
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//       // Still redirect to login even if request fails
//       router.push("/login");
//     }
//   };

//   return (
//     <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
          
//           {/* Logo */}
//           <Link
//             href="/"
//             className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
//           >
//             <ShoppingBag className="w-6 h-6 text-green-600" />
//             <span>Eagle3D App</span>
//           </Link>

//           {/* Desktop Menu */}
//           <nav className="hidden md:flex md:space-x-4">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
//               >
//                 <item.icon className="w-4 h-4 mr-1" />
//                 {item.name}
//               </Link>
//             ))}
//           </nav>

//           {/* Login / Logout + Username */}
//           <div className="hidden md:flex items-center space-x-3">
            
//             {/* IF NOT LOGGED IN */}
//             {!user && (
//               <Link href="/login">
//                 <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
//                   <LogIn className="w-4 h-4 inline-block mr-1" />
//                   Login
//                 </button>
//               </Link>
//             )}

//             {/* IF LOGGED IN */}
//             {user && (
//               <>
//                 {/* Show username */}
//                 <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
//                   <User className="w-4 h-4 mr-1" />
//                   {user.email}
//                 </div>

//                 {/* Logout button */}
//                 <button
//                   className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
//                   onClick={handleLogout}
//                 >
//                   <LogOut className="w-4 h-4 inline-block mr-1" />
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <button
//             onClick={toggleMenu}
//             className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`md:hidden transition-all overflow-hidden ${
//           isMenuOpen ? "max-h-96" : "max-h-0"
//         }`}
//       >
//         <div className="px-2 pt-2 pb-3">
//           {navItems.map((item) => (
//             <Link
//               key={item.name}
//               href={item.href}
//               onClick={() => setIsMenuOpen(false)}
//               className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 rounded-md"
//             >
//               <item.icon className="w-5 h-5 mr-3" />
//               {item.name}
//             </Link>
//           ))}

//           <div className="border-t pt-3">
//             {/* NOT LOGGED IN */}
//             {!user && (
//               <Link href="/login">
//                 <button
//                   className="w-full px-3 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-md"
//                 >
//                   <LogIn className="w-4 h-4 inline-block mr-2" />
//                   Login
//                 </button>
//               </Link>
//             )}

//             {/* LOGGED IN */}
//             {user && (
//               <>
//                 <div className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
//                   <User className="w-4 h-4 mr-2" />
//                   {user.email}
//                 </div>

//                 <button
//                   onClick={handleLogout}
//                   className="w-full px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-100 rounded-md"
//                 >
//                   <LogOut className="w-4 h-4 inline-block mr-2" />
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


// app/components/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  Home,
  Box,
  LogIn,
  LogOut,
  User,
  DollarSign,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../src/features/auth/authSlice";
import { logOut } from "../../src/features/auth/authSlice";
import { useLogoutMutation } from "../../src/services/authApi";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Products", href: "/products", icon: Box },
  { name: "Analytics", href: "/analytics", icon: DollarSign },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);
  const [logoutMutation] = useLogoutMutation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      // Step 1: Call backend logout API
      await logoutMutation().unwrap();
      
      // Step 2: Sign out from Firebase
      await signOut(auth);
      
      // Step 3: Clear Redux state
      dispatch(logOut());

      console.log('✅ Logout successful');
      
      // Step 4: Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      
      // Still clear state and redirect even if API call fails
      dispatch(logOut());
      await signOut(auth);
      router.push("/login");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
          >
            <ShoppingBag className="w-6 h-6 text-green-600" />
            <span>Eagle3D App</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <item.icon className="w-4 h-4 mr-1" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Login / Logout + Username */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* IF NOT LOGGED IN */}
            {!user && (
              <Link href="/login">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition inline-flex items-center">
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </button>
              </Link>
            )}

            {/* IF LOGGED IN */}
            {user && (
              <>
                {/* Show username */}
                <div className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">{user.email}</span>
                </div>

                {/* Logout button */}
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition inline-flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all overflow-hidden ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 bg-gray-50 dark:bg-gray-900">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}

          <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
            {/* NOT LOGGED IN */}
            {!user && (
              <Link href="/login">
                <button
                  className="w-full px-3 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-md flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </button>
              </Link>
            )}

            {/* LOGGED IN */}
            {user && (
              <>
                <div className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md mb-2">
                  <User className="w-4 h-4 mr-2" />
                  {user.email}
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}