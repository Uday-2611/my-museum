export const ADMIN_EMAIL = "udayagarwal234@gmail.com";

export function isAdminEmail(email: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
