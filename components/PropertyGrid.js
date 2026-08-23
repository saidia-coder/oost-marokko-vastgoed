"use client";

import React, { useState, useMemo } from "react";
import { MapPin, Search, BedDouble, Bath, Maximize2, X, MessageCircle, Waves, TreePine, Building2, ArrowUpRight } from "lucide-react";

const REGION_ICONS = { saidia: Waves, berkane: TreePine, oujda: Building2 };
const REGION_COLORS = { saidia: "var(--navy)", berkane: "var(--orange)", oujda: "var(--olive-deep)" };
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function formatPrice(n) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function imageUrl(storagePath) {
  if (!storagePath || !SUPABASE_URL) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/property-images/${storagePath}`;
}

function sortedImages(images) {
  if (!images || images.length === 0) return [];
  return [...images].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1;
    if (!a.is_cover && b.is_cover) return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });
}

function coverImageUrl(images) {
  const sorted = sortedImages(images);
  return sorted.length > 0 ? imageUrl(sorted[0].storage_path) : null;
}

function PropertyCard({ p, region, onOpen }) {
  const color = REGION_COLORS[p.region_id] || "var(--navy)";
  const cover = coverImageUrl(p.property_images);
  return (
    <div
      onClick={() => onOpen(p)}
      style={{ background: "var(--white)", border: "1px solid var(--line)", borderRadius: "4px", cursor: "pointer", overflow: "hidden" }}
    >
      <div
        style={{
          height: "150px",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          padding: "12px",
          backgroundImage: cover
            ? `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%), url(${cover})`
            : `linear-gradient(135deg, ${color}, var(--ink))`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span style={{ position: "absolute", top: 12, left: 12, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--white)", color: "var(--ink)", padding: "4px 8px", borderRadius: "2px", fontWeight: 600 }}>
          {p.status === "nieuwbouw" ? "Nieuwbouw" : "Bestaand"}
        </span>
        <span style={{ color: "var(--white)", fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 600 }}>
          {formatPrice(p.price_eur)}
        </span>
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", color, fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          <MapPin size={13} /> {region?.label || p.region_id}
        </div>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: 600, margin: "0 0 10px" }}>{p.title}</h3>
        <div style={{ display: "flex", gap: "14px", color: "var(--ink-soft)", fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Maximize2 size={13} /> {p.surface_m2}m²</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><BedDouble size={13} /> {p.bedrooms}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Bath size={13} /> {p.bathrooms}</span>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ p, region, onClose }) {
  if (!p) return null;
  const color = REGION_COLORS[p.region_id] || "var(--navy)";
  const images = sortedImages(p.property_images);
  const cover = images.length > 0 ? imageUrl(images[0].storage_path) : null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,17,10,0.55)", zIndex: 50, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(480px, 100%)", height: "100%", background: "var(--sand)", overflowY: "auto" }}>
        <div
          style={{
            height: "220px",
            position: "relative",
            padding: "16px",
            backgroundImage: cover
              ? `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%), url(${cover})`
              : `linear-gradient(135deg, ${color}, var(--ink))`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button onClick={onClose} style={{ background: "var(--white)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer" }}>
            <X size={18} />
          </button>
          <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--sand)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", marginBottom: "6px" }}>
              <MapPin size={13} /> {region?.label || p.region_id} · {p.status === "nieuwbouw" ? "Nieuwbouw" : "Bestaand"}
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "26px", fontWeight: 600, color: "var(--white)", margin: 0 }}>{p.title}</h2>
          </div>
        </div>

        {images.length > 1 && (
          <div style={{ display: "flex", gap: "6px", padding: "12px 20px 0", overflowX: "auto" }}>
            {images.slice(1).map((img, i) => (
              <img
                key={i}
                src={imageUrl(img.storage_path)}
                alt=""
                style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "3px", border: "1px solid var(--line)", flexShrink: 0 }}
              />
            ))}
          </div>
        )}

        <div style={{ padding: "20px" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", fontWeight: 600, marginBottom: "16px" }}>{formatPrice(p.price_eur)}</div>
          <div style={{ display: "flex", gap: "16px", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginBottom: "16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: "var(--ink-soft)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Maximize2 size={14} /> {p.surface_m2} m²</span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><BedDouble size={14} /> {p.bedrooms} slaapkamers</span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Bath size={14} /> {p.bathrooms} badkamers</span>
          </div>
          <p style={{ color: "var(--ink-soft)", fontSize: "15px", lineHeight: 1.6, marginBottom: "16px" }}>{p.description}</p>
          {p.tags && p.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
              {p.tags.map((t) => (
                <span key={t} style={{ fontSize: "12px", padding: "5px 10px", background: "var(--sand-deep)", borderRadius: "2px", border: "1px solid var(--line)" }}>{t}</span>
              ))}
            </div>
          )}
          <button style={{ width: "100%", background: "var(--olive)", color: "var(--white)", border: "none", padding: "14px", borderRadius: "3px", fontSize: "15px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}>
            <MessageCircle size={18} /> Vraag info via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PropertyGrid({ properties, regions, fetchError }) {
  const [activeRegion, setActiveRegion] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const types = useMemo(() => ["all", ...new Set(properties.map((p) => p.property_type))], [properties]);

  const filtered = properties.filter((p) => {
    if (activeRegion !== "all" && p.region_id !== activeRegion) return false;
    if (activeType !== "all" && p.property_type !== activeType) return false;
    if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const regionById = Object.fromEntries(regions.map((r) => [r.id, r]));

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", fontWeight: 700 }}>
          Oost·Marokko <span style={{ color: "var(--orange)" }}>Vastgoed</span>
        </div>
      </header>

      <section style={{ padding: "56px 24px 32px", maxWidth: "960px", margin: "0 auto" }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--olive)", marginBottom: "14px" }}>
          Kust tot binnenland · Oost-Marokko
        </p>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "42px", fontWeight: 600, lineHeight: 1.1, margin: "0 0 16px", maxWidth: "620px" }}>
          Vastgoed langs de corridor Saidia — Berkane — Oujda
        </h1>

        {fetchError && (
          <div style={{ padding: "12px 16px", background: "#FBEAEA", border: "1px solid #E0A9A9", borderRadius: "4px", color: "#7A2020", fontSize: "13px", marginBottom: "20px" }}>
            Kan geen verbinding maken met de database: {fetchError}. Controleer de omgevingsvariabelen (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).
          </div>
        )}

        <div style={{ display: "flex", background: "var(--white)", border: "1px solid var(--line)", borderRadius: "4px", padding: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", flex: 1, padding: "0 12px", gap: "8px" }}>
            <Search size={16} color="var(--ink-soft)" />
            <input
              placeholder="Zoek op woning, bijv. 'villa' of 'penthouse'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ border: "none", background: "transparent", flex: 1, padding: "10px 0", fontSize: "14px" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "28px" }}>
          <div style={{ display: "flex", height: "6px", borderRadius: "3px", overflow: "hidden", marginBottom: "14px" }}>
            <div style={{ flex: 1, background: "var(--navy)" }} />
            <div style={{ flex: 1, background: "var(--orange)" }} />
            <div style={{ flex: 1, background: "var(--olive-deep)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            <div
              onClick={() => setActiveRegion("all")}
              style={{ padding: "12px 14px", borderRadius: "3px", cursor: "pointer", border: `1px solid ${activeRegion === "all" ? "var(--ink)" : "var(--line)"}`, background: activeRegion === "all" ? "var(--ink)" : "var(--white)" }}
            >
              <div style={{ fontSize: "13px", fontWeight: 600, color: activeRegion === "all" ? "var(--white)" : "var(--ink)" }}>Volledig aanbod</div>
              <div style={{ fontSize: "12px", color: activeRegion === "all" ? "var(--sand)" : "var(--ink-soft)" }}>{properties.length} woningen</div>
            </div>
            {regions.map((r) => {
              const Icon = REGION_ICONS[r.id] || MapPin;
              const active = activeRegion === r.id;
              const count = properties.filter((p) => p.region_id === r.id).length;
              const color = REGION_COLORS[r.id] || "var(--navy)";
              return (
                <div
                  key={r.id}
                  onClick={() => setActiveRegion(r.id)}
                  style={{ padding: "12px 14px", borderRadius: "3px", cursor: "pointer", border: `1px solid ${active ? color : "var(--line)"}`, background: active ? color : "var(--white)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: active ? "var(--white)" : "var(--ink)" }}>
                    <Icon size={14} /> {r.label}
                  </div>
                  <div style={{ fontSize: "12px", color: active ? "var(--sand)" : "var(--ink-soft)", marginTop: "2px" }}>{r.tagline} · {count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", paddingBottom: "20px", borderBottom: "1px solid var(--line)" }}>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              style={{ padding: "7px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 500, cursor: "pointer", border: `1px solid ${activeType === t ? "var(--ink)" : "var(--line)"}`, background: activeType === t ? "var(--ink)" : "transparent", color: activeType === t ? "var(--white)" : "var(--ink)" }}
            >
              {t === "all" ? "Alle types" : t}
            </button>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "28px 24px 60px" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 600, marginBottom: "18px" }}>
          {filtered.length} {filtered.length === 1 ? "woning" : "woningen"}
        </h2>
        {filtered.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-soft)", border: "1px dashed var(--line)", borderRadius: "4px" }}>
            Nog geen gepubliceerde woningen voor deze selectie. Voeg een rij toe in de "properties" tabel in Supabase met is_published = true.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" }}>
            {filtered.map((p) => (
              <PropertyCard key={p.id} p={p} region={regionById[p.region_id]} onOpen={setSelected} />
            ))}
          </div>
        )}
      </section>

      <section style={{ background: "var(--navy-deep)", padding: "48px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h3 style={{ fontFamily: "'Fraunces', serif", color: "var(--white)", fontSize: "24px", fontWeight: 600, margin: "0 0 8px" }}>
              Niet gevonden wat je zoekt?
            </h3>
            <p style={{ color: "#B9C6CE", fontSize: "14px", margin: 0 }}>Wij horen als eerste van nieuwe projecten in Saidia, Berkane en Oujda.</p>
          </div>
          <button style={{ background: "var(--orange)", color: "var(--white)", border: "none", padding: "13px 22px", borderRadius: "3px", fontWeight: 600, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            Neem contact op <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      <footer style={{ padding: "20px 24px", textAlign: "center", fontSize: "12px", color: "var(--ink-soft)" }}>
        Oost-Marokko Vastgoed — Saidia · Berkane · Oujda
      </footer>

      <DetailPanel p={selected} region={selected ? regionById[selected.region_id] : null} onClose={() => setSelected(null)} />
    </div>
  );
}
