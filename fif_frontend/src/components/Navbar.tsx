// "use client";
// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <motion.nav
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="w-full fixed top-0 left-0 bg-white/70 backdrop-blur-md shadow-sm z-50"
//     >
//       <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-zinc-900">Fix-It-Flow</h1>

//         <div className="space-x-6 text-zinc-700 font-medium">
//           <Link to="/">Home</Link>
//           <Link to="#upload">Report Issue</Link>
//           {user ? (
//             <button
//               onClick={handleLogout}
//               className="hover:text-zinc-900 transition cursor-pointer"
//             >
//               Logout
//             </button>
//           ) : (
//             <Link to="/auth">Login</Link>
//           )}
//         </div>
//       </div>
//     </motion.nav>
//   );
// }
