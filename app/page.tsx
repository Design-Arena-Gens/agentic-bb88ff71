"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { maritimeCompanies } from "@/data/companies";

type FilterState = {
  query: string;
  sector: string;
  region: string;
};

const baseFilters: FilterState = {
  query: "",
  sector: "tous",
  region: "toutes"
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(baseFilters);

  const sectors = useMemo(() => {
    const values = new Set<string>();
    maritimeCompanies.forEach((company) =>
      company.sectors.forEach((sector) => values.add(sector))
    );
    return ["tous", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, []);

  const regions = useMemo(() => {
    const values = new Set(
      maritimeCompanies.map((company) => company.headquarters)
    );
    return ["toutes", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, []);

  const filteredCompanies = useMemo(() => {
    return maritimeCompanies.filter((company) => {
      const matchesQuery =
        filters.query.length === 0 ||
        company.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        company.description
          .toLowerCase()
          .includes(filters.query.toLowerCase());

      const matchesSector =
        filters.sector === "tous" ||
        company.sectors.some((sector) => sector === filters.sector);

      const matchesRegion =
        filters.region === "toutes" || company.headquarters === filters.region;

      return matchesQuery && matchesSector && matchesRegion;
    });
  }, [filters]);

  return (
    <main style={styles.main}>
      <section style={styles.header}>
        <div>
          <h1 style={styles.title}>Panorama Maritime Algérien</h1>
          <p style={styles.subtitle}>
            Explorez les entreprises algériennes connectées à la mer, du
            transport aux services portuaires en passant par l&apos;offshore.
          </p>
        </div>
        <div style={styles.filters}>
          <label style={styles.filterField}>
            <span style={styles.label}>Recherche</span>
            <input
              type="text"
              placeholder="Nom, activité ou description…"
              value={filters.query}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  query: event.target.value
                }))
              }
              style={styles.input}
            />
          </label>
          <label style={styles.filterField}>
            <span style={styles.label}>Secteur</span>
            <select
              value={filters.sector}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  sector: event.target.value
                }))
              }
              style={styles.select}
            >
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector === "tous" ? "Tous les secteurs" : sector}
                </option>
              ))}
            </select>
          </label>
          <label style={styles.filterField}>
            <span style={styles.label}>Région</span>
            <select
              value={filters.region}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  region: event.target.value
                }))
              }
              style={styles.select}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === "toutes" ? "Toutes les wilayas" : region}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p style={styles.count}>
          {filteredCompanies.length} entreprise
          {filteredCompanies.length > 1 ? "s" : ""} référencée
        </p>
      </section>

      <section style={styles.grid}>
        {filteredCompanies.map((company) => (
          <article key={company.name} style={styles.card}>
            <header>
              <h2 style={styles.cardTitle}>{company.name}</h2>
              <p style={styles.cardRegion}>{company.headquarters}</p>
            </header>
            <p style={styles.cardDescription}>{company.description}</p>
            <div style={styles.badgeRow}>
              {company.sectors.map((sector) => (
                <span key={sector} style={styles.badge}>
                  {sector}
                </span>
              ))}
            </div>
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                style={styles.link}
              >
                Consulter le site
              </a>
            ) : (
              <span style={styles.linkDisabled}>Site non communiqué</span>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  main: {
    width: "min(1100px, 92vw)",
    padding: "32px 0 64px",
    display: "flex",
    flexDirection: "column",
    gap: "28px"
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "32px",
    borderRadius: "24px",
    background:
      "linear-gradient(120deg, rgba(30, 64, 175, 0.55), rgba(13, 148, 136, 0.55))",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.45)",
    border: "1px solid rgba(226, 232, 240, 0.08)"
  },
  title: {
    margin: 0,
    fontSize: "2.75rem",
    fontWeight: 700,
    letterSpacing: "-0.02em"
  },
  subtitle: {
    margin: "12px 0 0",
    maxWidth: "640px",
    color: "rgba(226, 232, 240, 0.85)"
  },
  filters: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px"
  },
  filterField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(241, 245, 249, 0.7)"
  },
  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    color: "#e2e8f0"
  },
  select: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    color: "#e2e8f0"
  },
  count: {
    margin: 0,
    fontSize: "0.95rem",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "rgba(226, 232, 240, 0.7)"
  },
  grid: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))"
  },
  card: {
    position: "relative",
    padding: "24px",
    borderRadius: "20px",
    background: "rgba(15, 23, 42, 0.82)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    boxShadow: "0 18px 36px rgba(15, 23, 42, 0.45)",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.35rem",
    color: "#f1f5f9"
  },
  cardRegion: {
    margin: "6px 0 0",
    color: "rgba(148, 163, 184, 0.8)",
    fontSize: "0.95rem"
  },
  cardDescription: {
    margin: 0,
    color: "rgba(226, 232, 240, 0.9)",
    minHeight: "72px"
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "0.8rem",
    background: "rgba(59, 130, 246, 0.18)",
    color: "rgba(191, 219, 254, 0.95)",
    border: "1px solid rgba(96, 165, 250, 0.35)"
  },
  link: {
    marginTop: "auto",
    color: "#38bdf8",
    fontWeight: 600
  },
  linkDisabled: {
    marginTop: "auto",
    color: "rgba(148, 163, 184, 0.6)",
    fontWeight: 500
  }
};
