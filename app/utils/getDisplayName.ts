export function getDisplayName(user: any) {
  const metadataName = user?.user_metadata?.display_name;
  const emailName = user?.email?.split("@")[0];

  const name = metadataName || emailName || "User";

  return name.charAt(0).toUpperCase() + name.slice(1);
}