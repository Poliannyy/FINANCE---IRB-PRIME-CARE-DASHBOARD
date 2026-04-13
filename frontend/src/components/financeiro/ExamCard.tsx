"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Tag } from "lucide-react";
import type { Exam } from "@/lib/mockData";

interface ExamCardProps {
  exam: Exam;
}

const categoryColors: Record<string, string> = {
  Laboratorial: "#3b82f6",
  Imagem: "#8b5cf6",
  Cardiologia: "#ef4444",
  Oftalmologia: "#06b6d4",
  Ortopedia: "#f97316",
  Dermatologia: "#ec4899",
  Ginecologia: "#a855f7",
  Urologia: "#14b8a6",
  Outros: "#6b7280",
};

function PriceTag({ label, value }: { label: string; value: number | null | undefined }) {
  if (value == null) return null;
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "8px 14px", borderRadius: "var(--radius-sm)",
      background: "var(--background)", border: "1px solid var(--border)",
      minWidth: 100,
    }}>
      <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, marginBottom: 2 }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>
        {value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </span>
    </div>
  );
}

export default function ExamCard({ exam }: ExamCardProps) {
  const [expanded, setExpanded] = useState(false);
  const color = categoryColors[exam.category] ?? "#6b7280";

  const hasPrimePrices =
    exam.price_prime_plus != null ||
    exam.price_prime_essential != null ||
    exam.price_prime_elite != null;

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px 18px", cursor: "pointer",
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: 15, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {exam.name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
            <Tag size={11} color={color} />
            <span style={{ fontSize: 12, color, fontWeight: 500 }}>{exam.category}</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>IRB Particular</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
            {exam.price_particular.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
        {hasPrimePrices && (
          <div style={{ color: "var(--muted)", flexShrink: 0, marginLeft: 4 }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        )}
      </div>
      {expanded && hasPrimePrices && (
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "14px 18px",
          display: "flex", flexWrap: "wrap", gap: 10,
          background: "var(--muted-bg, var(--background))",
        }}>
          {exam.description && (
            <p style={{ width: "100%", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
              {exam.description}
            </p>
          )}
          <PriceTag label="Prime Plus" value={exam.price_prime_plus} />
          <PriceTag label="Prime Essential" value={exam.price_prime_essential} />
          <PriceTag label="Prime Elite" value={exam.price_prime_elite} />
        </div>
      )}
    </div>
  );
}
