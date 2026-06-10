/**
 * DEPRECATED: AdminLogin page (Manus OAuth)
 * Redirects to LocalLogin for local authentication
 */

import { useEffect } from "react";

export default function AdminLogin() {
  useEffect(() => {
    // Redirect to LocalLogin
    window.location.href = "/admin";
  }, []);

  return null;
}
