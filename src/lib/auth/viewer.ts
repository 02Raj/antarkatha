import { isAdminRole, isStaffRole } from "@/lib/domain/access";
import { createServerSupabase } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export type Viewer = {
  id: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  isStaff: boolean;
  isAdmin: boolean;
};

export async function getViewer(): Promise<Viewer | null> {
  const supabase = await createServerSupabase();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const role: UserRole = profile?.role ?? "user";

  return {
    id: user.id,
    email: user.email ?? null,
    displayName: profile?.display_name ?? user.email ?? null,
    role,
    isStaff: isStaffRole(role),
    isAdmin: isAdminRole(role),
  };
}

export function toHeaderViewer(viewer: Viewer | null) {
  if (!viewer) return null;
  return { displayName: viewer.displayName, isStaff: viewer.isStaff };
}
