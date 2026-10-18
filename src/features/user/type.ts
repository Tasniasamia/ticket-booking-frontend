// GET /auth/me এর response (dto.UserResponse) কে frontend এর Profile এ বদলায়।
// Backend এর json tag বদলালে শুধু এই ফাইলের toProfile ঠিক করলেই হবে।

export type Role = "user" | "manager" | "admin";

export type Profile = {
  id: number;
  name: string;
  email: string;
  role: Role;
  address: string;
  phone_number: string;
  country: string;
  designation: string; // শুধু manager এর থাকে
  profile_image_id:number | null;
  profile_image:string | null;
  createdAt: string;
};

type Raw = Record<string, unknown>;

const str = (d: Raw, ...keys: string[]) => {
  for (const k of keys) if (typeof d[k] === "string") return d[k] as string;
  return "";
};

export function toProfile(d: Raw): Profile {
  const role = str(d, "role").toLowerCase();
  return {
    id: Number(d.id ?? 0),
    name: str(d, "name"),
    email: str(d, "email"),
    role: role === "admin" || role === "manager" ? role : "user",
    address: str(d, "address"),
    phone_number: str(d, "phone_number", "phoneNumber"),
    country: str(d, "country"),
    designation: str(d, "designation"),
    profile_image_id: d.profile_image_id as number || 0,
    profile_image: str(d, "profile_image", "profileImage") || null,
    createdAt: str(d, "created_at", "createdAt"),
  };
}


export function memberSince(iso: string) {
  const date = new Date(iso.replace(" ", "T"));

  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
      }).format(date);
}