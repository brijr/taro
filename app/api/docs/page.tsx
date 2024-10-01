"use client";

import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  useEffect(() => {
    // This is to fix a hydration issue with Swagger UI
    const style = document.createElement('style');
    style.innerHTML = '.swagger-ui .scheme-container { display: none }';
    document.head.appendChild(style);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <SwaggerUI url="/openapi.yaml" />
    </div>
  );
}
