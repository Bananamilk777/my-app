export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/hello") {
      return new Response("Hello from Worker API");
    }

    return new Response("Not Found", { status: 404 });
  },
};