import { organizationA, organizationB } from "./properties";

export const demoAccounts = [
  {
    email: "owner.a@example.test",
    role: "owner",
    display_name: "Owner A",
    org: organizationA,
    active: true,
  },
  {
    email: "andi@example.test",
    role: "sales",
    display_name: "Andi",
    org: organizationA,
    active: true,
  },
  {
    email: "sari@example.test",
    role: "sales",
    display_name: "Sari",
    org: organizationA,
    active: true,
  },
  {
    email: "inactive@example.test",
    role: "sales",
    display_name: "Tidak aktif",
    org: organizationA,
    active: false,
  },
  {
    email: "owner.b@example.test",
    role: "owner",
    display_name: "Owner B",
    org: organizationB,
    active: true,
  },
] as const;
