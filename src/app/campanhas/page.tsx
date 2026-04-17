"use client";
// Refreshed by Gemini to clear TS cache
import { useState, useEffect } from "react";
import { Plus, Megaphone } from "lucide-react";
import CampanhaCard from "@/app/components/CampanhaCard";
import { CampanhaAPI } from "@/lib/api";
import type { Campanha } from "@/lib/mockData";

const tabs = ["ativa", "pausada", "encerrada", "todas"];

const emptyForm = {
  nome: "",
  descricao: "",
  desconto_percentual: "",
  status: "ativa" as Campanha["status"],
  data_inicio: "",
  data_fim: "",
};

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState("ativa");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCampanhas(); }, []);

  async function loadCampanhas() {
    const data = await CampanhaAPI.list();
    setCampanhas(data);
    setLoading(false);
  }

  async function handleCreate() {
    if (!form.nome || !form.desconto_percentual) return;
    setSaving(true);
    await CampanhaAPI.create({
      nome: form.nome,
      descricao: form.descricao,
      desconto_percentual: parseFloat(form.desconto_percentual) || 0,
      status: form.status,
      data_inicio: form.data_inicio || new Date().toISOString().split("T")[0],
      data_fim: form.data_fim || new Date().toISOString().split("T")[0],
    });
    setDialogOpen(false);
    setForm(emptyForm);
    setSaving(false);
    loadCampanhas();
  }

  const filtered = campanhas.filter(c => tab === "todas" || c.status === tab);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
        <div style={{ width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%" }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)" }}>Campanhas</h1>
          <p style={{ color: "var(--muted)", marginTop: 4 }}>Gerencie promoções e descontos</p>
        </div>
        <button onClick={() => setDialogOpen(true)} style={btnPrimaryWithIcon}>
          <Plus size={16} /> Nova Campanha
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4,
        padding: 4, borderRadius: "var(--radius-sm)",
        background: "var(--muted-bg)",
        width: "fit-content", marginBottom: 24,
      }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 16px", borderRadius: 6,
            border: "none", cursor: "pointer",
            fontWeight: tab === t ? 600 : 400,
            fontSize: 13,
            background: tab === t ? "var(--card)" : "transparent",
            color: tab === t ? "var(--foreground)" : "var(--muted)",
            boxShadow: tab === t ? "var(--shadow-sm)" : "none",
            transition: "all 0.15s",
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Campanha grid */}
      {filtered.length === 0 ? (
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "64px 32px", textAlign: "center",
        }}>
          <Megaphone size={48} color="var(--border)" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "var(--muted)" }}>Nenhuma campanha encontrada</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map(c => <CampanhaCard key={c.id} campanha={c} />)}
        </div>
      )}

      {/* Dialog */}
      {dialogOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }} onClick={e => { if (e.target === e.currentTarget) setDialogOpen(false); }}>
          <div style={{
            background: "var(--card)", borderRadius: "var(--radius-lg)",
            padding: 28, width: "100%", maxWidth: 500,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Criar Nova Campanha</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Nome da Campanha">
                <input placeholder="Ex: Promoção de Inverno" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Descrição">
                <input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} style={inputStyle} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Desconto (%)">
                  <input type="number" value={form.desconto_percentual} onChange={e => setForm({ ...form, desconto_percentual: e.target.value })} style={inputStyle} />
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Campanha["status"] })} style={inputStyle}>
                    <option value="ativa">Ativa</option>
                    <option value="pausada">Pausada</option>
                    <option value="encerrada">Encerrada</option>
                  </select>
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Data Início"><input type="date" value={form.data_inicio} onChange={e => setForm({ ...form, data_inicio: e.target.value })} style={inputStyle} /></Field>
                <Field label="Data Fim"><input type="date" value={form.data_fim} onChange={e => setForm({ ...form, data_fim: e.target.value })} style={inputStyle} /></Field>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setDialogOpen(false)} style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
                <button onClick={handleCreate} disabled={!form.nome || !form.desconto_percentual || saving} style={{ ...btnPrimary, flex: 1, opacity: (!form.nome || !form.desconto_percentual) ? 0.5 : 1 }}>
                  {saving ? "Salvando..." : "Criar Campanha"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)", background: "var(--background)",
  fontSize: 14, color: "var(--foreground)", outline: "none",
};
const btnPrimary: React.CSSProperties = {
  padding: "10px 18px", borderRadius: "var(--radius-sm)",
  background: "var(--primary)", color: "#fff",
  border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
};
const btnPrimaryWithIcon: React.CSSProperties = {
  ...btnPrimary,
  display: "flex", alignItems: "center", gap: 8,
  boxShadow: "var(--shadow-sm)",
};
const btnSecondary: React.CSSProperties = {
  padding: "10px 18px", borderRadius: "var(--radius-sm)",
  background: "var(--muted-bg)", color: "var(--foreground)",
  border: "1px solid var(--border)", cursor: "pointer", fontWeight: 500, fontSize: 14,
};