export function isDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}

const spaces = "\u0020\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000";

export function isSpace(c: string): boolean {
  return c !== "" && spaces.includes(c);
}
