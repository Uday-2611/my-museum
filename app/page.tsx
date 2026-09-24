import { HomeExperience } from "@/components/home-experience";
import { getRooms } from "@/lib/museum/data";

export const dynamic = "force-dynamic";
export default async function HomePage() {
  const rooms = await getRooms();
  return <HomeExperience rooms={rooms} />;
}
