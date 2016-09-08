// Utility function to determine if server is running in production mode
export function isProduction(): boolean {
  return (process.env.NODE_ENV === 'production');
}
