import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

type Role = "user" | "caregiver" | "admin";

const WithRole = ({ children, role }: { children: any; role: Role }) => {
    const user = useQuery(api.users.viewer);

    if (user?.role !== role) {
        return <></>;
    }

    return <>{children}</>;
};

export default WithRole;