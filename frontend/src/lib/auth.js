export function decodeToken(token) {
  try {
    if (!token) return null;
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function getValidPayload(token) {
  const payload = decodeToken(token);
  if (!payload) return null;
  if (payload.exp && Date.now() >= payload.exp * 1000) return null;
  return payload;
}
