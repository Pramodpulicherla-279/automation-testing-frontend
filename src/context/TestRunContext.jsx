/**
 * Shared "a test run is in progress" flag.
 *
 * While a run is live the UI locks down so nothing can change the configuration
 * underneath it — the Appium server, the app/APK selection, test types, network
 * profile, and navigation away from the run screen.
 *
 * This lives outside App.jsx because the Sidebar renders as a sibling of the
 * routed TestScreen and also has to read the flag; importing it from App.jsx
 * would make App and its own children circular.
 *
 * Seeded from sessionStorage (TestScreen keeps it written), so refreshing the
 * page mid-run comes back locked rather than wide open.
 */

import React, { createContext, useContext, useState } from "react";

const TestRunContext = createContext({
  isRunning:    false,
  setIsRunning: () => {},
});

export function useTestRun() {
  return useContext(TestRunContext);
}

export function TestRunProvider({ children }) {
  const [isRunning, setIsRunning] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("isRunning")) === true; }
    catch { return false; }
  });

  return (
    <TestRunContext.Provider value={{ isRunning, setIsRunning }}>
      {children}
    </TestRunContext.Provider>
  );
}
