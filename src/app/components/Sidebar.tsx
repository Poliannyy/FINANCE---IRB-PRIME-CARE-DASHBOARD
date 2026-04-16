"use client";
import { LayoutDashboard, DollarSign, Megaphone, Shield, Users } from "lucide-react";

const menus = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "financeiro", label: "Financeiro", icon: DollarSign },
  { key: "campanhas", label: "Campanhas", icon: Megaphone },
  { key: "planos", label: "Planos", icon: Shield },
  { key: "pacientes", label: "Pacientes", icon: Users },
];

export default function Sidebar({ active, onChange }: { active: string; onChange: (k: string) => void }) {
  return (
    <aside style={{
      width: 260, minHeight: "100vh", background: "var(--white)",
      borderRight: "1px solid var(--border)", display: "flex",
      flexDirection: "column", padding: "24px 16px", position: "fixed",
      top: 0, left: 0, bottom: 0, zIndex: 10
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, paddingLeft: 8 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: "var(--blue)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 700, fontSize: 16
        }}>I</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>IRB Prime Care</div>
          <div style={{ fontSize: 11, color: "var(--text-light)" }}>Finance System</div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {menus.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => onChange(key)} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 10, border: "none",
            cursor: "pointer", width: "100%", textAlign: "left",
            fontWeight: active === key ? 600 : 400,
            fontSize: 14,
            background: active === key ? "var(--blue)" : "transparent",
            color: active === key ? "white" : "var(--text-mid)",
            transition: "all 0.15s"
          }}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div style={{
        padding: "12px 14px", borderRadius: 10,
        background: "var(--bg)", border: "1px solid var(--border)"
      }}>
        <div style={{ fontSize: 12, color: "var(--text-mid)", fontWeight: 500 }}>IRB Prime Care Finance</div>
        <div style={{ fontSize: 11, color: "var(--text-light)" }}>v1.0.0</div>
      </div>
    </aside>
  );
}