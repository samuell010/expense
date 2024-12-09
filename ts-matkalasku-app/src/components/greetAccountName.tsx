import { useAuth0 } from "@auth0/auth0-react";

const GreetPerson = () => {
  const { user, isAuthenticated } = useAuth0(); // Get user info from Auth0

  const getFirstNameFromEmail = (email: string): string => {
    if (!email) return "User";

    // Splits the email of the user from the "@" and from the "." leaving the first name, 
    // should also work if there's no "." in the gmail address
    const firstName = email.split("@")[0].split(".")[0];

    // Uppercase first letter
    return firstName.charAt(0).toUpperCase() + firstName.slice(1); 
  };

  // Add fallback for user.email if it is undefined
  const firstName = isAuthenticated && user?.email ? getFirstNameFromEmail(user.email) : "User";

  return (
      <span>{firstName}</span>
  );
};

export default GreetPerson;
