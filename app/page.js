import { supabase } from "@/lib/supabase";
import PropertyGrid from "@/components/PropertyGrid";

export const revalidate = 60; // haal elke 60s verse data op

export default async function Home() {
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*, property_images(storage_path, is_cover, sort_order)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const { data: regions } = await supabase
    .from("regions")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <PropertyGrid
      properties={properties || []}
      regions={regions || []}
      fetchError={error ? error.message : null}
    />
  );
}
