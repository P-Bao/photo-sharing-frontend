/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 * @param {object} options  Optional fetch settings such as method, headers, and body.
 *
 */

const baseUrl = "https://47y2yt-8081.csb.app";

async function fetchModel(url, options = {}) {
  // const models = null;
  // return models;

  try {
    const { method = "GET", body, headers = {}, ...requestOptions } = options;

    const requestHeaders = { ...headers };
    let requestBody = body;
    if (
      body !== undefined &&
      !(body instanceof FormData) &&
      typeof body !== "string"
    ) {
      requestHeaders["Content-Type"] = "application/json";
      requestBody = JSON.stringfy(body);
    }

    const response = await fetch(`${baseUrl}/${url}`, {
      method: method,
      credentials: "include",
      ...requestOptions,
      headers: requestHeaders,
      body: requestBody,
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return response.text();
  } catch (error) {
    console.error(`Fetch failed for ${url} error: ${error}`);
    throw error;
  }
}

export default fetchModel;
