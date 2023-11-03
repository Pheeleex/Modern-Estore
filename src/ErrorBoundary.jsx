import React, { useState } from 'react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (error, errorInfo) => {
    // You can log the error to an error reporting service here
    console.error(error, errorInfo);
    setHasError(true);
  };

  if (hasError) {
    // You can render any custom fallback UI here
    return <h1>Something went wrong.</h1>;
  }

  return children;
};

export default ErrorBoundary;
