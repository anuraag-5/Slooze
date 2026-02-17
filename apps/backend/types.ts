import { Country, Role } from "@prisma/client";

export type UserType = {
    id: string;
    name: string;
    email: string;
    role: Role;
    country: Country;
}