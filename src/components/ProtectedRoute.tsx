import { useUser } from '../hooks/useUser';
import { Route, Redirect } from 'wouter';
import type { RouteProps } from 'wouter';

export const ProtectedRoute = (props: RouteProps) => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    // If there is no user, redirect to the login page
    return <Redirect to="/" />;
  }

  // If there is a user, render the component for the route
  return <Route {...props} />;
};