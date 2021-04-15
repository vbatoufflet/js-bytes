export function isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
}

const spaces = [
    "\u0020", // Space,
    "\u00a0", // No-Break Space,
    "\u1680", // Ogham Space Mark,
    "\u2000", // En Quad,
    "\u2001", // Em Quad,
    "\u2002", // En Space,
    "\u2003", // Em Space,
    "\u2004", // Three-Per-Em Space,
    "\u2005", // Four-Per-Em Space,
    "\u2006", // Six-Per-Em Space,
    "\u2007", // Figure Space,
    "\u2008", // Punctuation Space,
    "\u2009", // Thin Space,
    "\u200a", // Hair Space,
    "\u202f", // Narrow No-Break Space,
    "\u205f", // Medium Mathematical Space,
    "\u3000", // Ideographic Space,
].join("");

export function isSpace(c: string): boolean {
    return spaces.includes(c);
}
