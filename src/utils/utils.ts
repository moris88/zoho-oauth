export function buildUrlWithParams(
  url: URL,
  params: string
) {
  if (!url) return "";
  if (!params) return url.toString();
  if (params.length === 0) return url.toString();
  params.split('&').map((el) => {
    const [key, value] = el.split('=');
    return { key, value };
  }).forEach(({ key, value }) => {
    console.log(key, value);
    if (key) url.searchParams.append(key, value);
  });
  return url.toString();
}

// Funzione per costruire gli headers
export function buildHeaders(headersArrayString: string) {
  const headersObj: Record<string, string> = {};
  if (!headersArrayString) return headersObj;
  const headersArray = JSON.parse(headersArrayString || '[]') as { key: string; value: string }[];
  if (headersArray.length === 0) return headersObj;
  headersArray.forEach(({ key, value }) => {
    if (key) headersObj[key] = value;
  });
  return headersObj;
}
