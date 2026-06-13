import { useState } from "react";

export function useMobileNav() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
