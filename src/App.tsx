import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./routes";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import { CartProvider } from "./contexts/CartContext";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <CartProvider>
              <Toaster
                position="top-right"
                expand={false}
                richColors
                closeButton
                theme="light"
                duration={4000}
                toastOptions={{
                  style: {
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "0.5rem",
                  },
                  className: "shadow-lg",
                }}
              />
              <AuthenticatedApp />
            </CartProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function AuthenticatedApp() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const user = localStorage.getItem("auth_user");

    if (!token || !user) {
      const protectedRoutes = ["/dashboard", "/products", "/posts", "/comments"];
      if (protectedRoutes.some((route) => location.pathname.startsWith(route))) {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, location]);

  return <AppRouter />;
}

export default App;
