export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);

    if (url.hostname.endsWith(".pages.dev")) {
        url.hostname = "lukasrozado.com";
        return Response.redirect(url.toString(), 301);
    }

    return next();
}
