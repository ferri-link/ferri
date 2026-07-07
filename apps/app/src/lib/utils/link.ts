export const LINK_CODE_LENGTH = 8;

// Codes are matched case-insensitively, so we only ever generate lowercase.
const LINK_CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function generateLinkCode(length = LINK_CODE_LENGTH): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += LINK_CODE_ALPHABET.charAt(
      Math.floor(Math.random() * LINK_CODE_ALPHABET.length),
    );
  }
  return code;
}
