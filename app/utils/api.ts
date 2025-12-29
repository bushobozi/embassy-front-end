import { getAccessToken } from "./cookies";

/**
 * Make an authenticated API request with access token from cookies
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("No access token found. User must be logged in.");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("Content-Type", "application/json");

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Example: GET request with authentication
 */
export async function apiGet(url: string): Promise<any> {
  const response = await authenticatedFetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Example: POST request with authentication
 */
export async function apiPost(url: string, data: any): Promise<any> {
  const response = await authenticatedFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Example: PUT request with authentication
 */
export async function apiPut(url: string, data: any): Promise<any> {
  const response = await authenticatedFetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Example: DELETE request with authentication
 */
export async function apiDelete(url: string): Promise<any> {
  const response = await authenticatedFetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}
