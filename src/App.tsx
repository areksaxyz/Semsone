import React, { useEffect } from 'react';
import Router from './router/Router';

function runSelfTests() {
  try {
    const d = new Date().toISOString().slice(0, 10);
    console.assert(/^\d{4}-\d{2}-\d{2}$/.test(d), "Date should be YYYY-MM-DD");
    console.info("✅ SemsOne self-tests passed");
  } catch (e) {
    console.error("❌ SemsOne self-tests failed", e);
  }
}

export default function App() {
  useEffect(() => {
    if ((import.meta as any)?.env?.DEV) runSelfTests();
  }, []);
  return <Router />;
}
