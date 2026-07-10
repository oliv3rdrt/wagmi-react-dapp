// Shorten a hex address to `0x1234…cdef` for compact display. `chars` is the
// number of hex characters to keep on each side of the ellipsis.
export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}
