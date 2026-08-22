import type { Access } from "payload";

/** Shipment tracking is public by design — anyone with a tracking number can view it. */
export const readPublic: Access = () => true;

/** Only authenticated staff (admin / manager / editor) can create or modify records. */
export const staffWrite: Access = ({ req: { user } }) => {
  if (!user) return false;
  return ["admin", "manager", "editor"].includes(user.role);
};