/**
 * DEPRECATED: useAuth hook (Manus OAuth)
 * Use useLocalAuth instead for local authentication
 * 
 * This file is kept for backward compatibility only
 */

import { useLocalAuth } from "./useLocalAuth";

export function useAuth() {
  // Redirect to useLocalAuth
  return useLocalAuth();
}
