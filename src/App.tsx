// App.js

import { Switch, Route } from "wouter";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Page imports
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RequestDelivery from "./pages/RequestDelivery";
import FindDeliveries from "./pages/FindDeliveries";
import MyRequests from "./pages/MyRequests";
import MyDeliveries from "./pages/MyDeliveries"; // ✅ Real component
import Profile from "./pages/Profile";
import LoginError from "./pages/LoginError";
function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Switch>
        {/* Public Route */}
        <Route path="/" component={Login} />

        {/* Protected Routes */}
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/request-delivery" component={RequestDelivery} />
        <ProtectedRoute path="/find-deliveries" component={FindDeliveries} />
        <ProtectedRoute path="/my-requests" component={MyRequests} />
        <ProtectedRoute path="/my-deliveries" component={MyDeliveries} />
        <ProtectedRoute path="/profile" component={Profile} />
         <Route path="/login-error" component={LoginError} />

        {/* Fallback route */}
        <Route>404: Page Not Found!</Route>
      </Switch>
    </>
  );
}

export default App;
