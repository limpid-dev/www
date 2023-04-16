export interface BadCsrfToken {
  message: "E_BAD_CSRF_TOKEN: Invalid CSRF Token";
}

export function isBadCsrfToken(input: unknown): input is BadCsrfToken {
  return (
    input instanceof Object &&
    "message" in input &&
    input.message === "E_BAD_CSRF_TOKEN: Invalid CSRF Token"
  );
}
