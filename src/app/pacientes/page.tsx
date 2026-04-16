"use client";
// Refreshed by Gemini to clear TS cache
import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Users } from "lucide-react";
import PacienteCard from "@/app/components/PacienteCard";
import { PacienteAPI } from "@/lib/api";
import type { Paciente } from "@/lib/mockData";

const journeyOptions = ["primeiro_contato", "avaliacao", "tratamento", "acompanhamento", "fidelizado"] as const;
const journeyLabels: Record<string, string> = {
  primeiro_contato: "1º Contato",
  avaliacao: "Avaliação",
  tratamento: "Tratamento",
  acompanhamento: "Acompanhamento",
  fidelizado: "Fidelizado",
};
const journeyTabs = ["Todos", ...journeyOptions];

const emptyForm = {
  nome: "", idade: "", telefone: "", email: "",
  etapa_jornada: "primeiro_contato" as Paciente["etapa_jornada"],
  observacoes: "",
  data_nascimento: "",
};

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [journeyFilter, setJourneyFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadPacientes(); }, []);

  async function loadPacientes() {
    const data = await PacienteAPI.list();
    setPacientes(data);
    setLoading(false);
  }

  const filtered = useMemo(() => pacientes.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase());
    const matchJourney = journeyFilter === "Todos" || p.etapa_jornada === journeyFilter;
    return matchSearch && matchJourney;
  }), [pacientes, search, journeyFilter]);

  async function handleCreate() {
    if (!form.nome) return;
    setSaving(true);
    await PacienteAPI.create({
      nome: form.nome,
      idade: form.idade ? parseInt(form.idade) : 0,
      telefone: form.telefone,
      email: form.email,
      etapa_jornada: form.etapa_jornada,
      observacoes: form.observacoes,
      data_nascimento: form.data_nascimento || new Date().toISOString().split("T")[0],
    });
    setDialogOpen(false);
    setForm(emptyForm);
    setSaving(false);
    loadPacientes();
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
        <div style={{ width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%" }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)" }}>Pacientes</h1>
          <p style={{ color: "var(--muted)", marginTop: 4 }}>Perfil e jornada dos pacientes</p>
        </div>
        <button onClick={() => setDialogOpen(true)} style={btnPrimaryWithIcon}>
          <Plus size={16} /> Novo Paciente
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar paciente..."
          style={searchInputStyle}
        />
      </div>

      {/* Journey tabs */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 20 }}>
        {journeyTabs.map(t => (
          <button key={t} onClick={() => setJourneyFilter(t)} style={{
            padding: "7px 14px", borderRadius: 20,
            border: journeyFilter === t ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            background: journeyFilter === t ? "var(--primary-light)" : "var(--card)",
            color: journeyFilter === t ? "var(--primary)" : "var(--muted)",
            fontWeight: journeyFilter === t ? 600 : 400,
            fontSize: 13, cursor: "pointer", transition: "all 0.15s",
          }}>{journeyLabels[t] || t}</button>
        ))}
      </div>

      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        {filtered.length} paciente{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Patient grid */}
      {filtered.length === 0 ? (
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "64px 32px", textAlign: "center",
        }}>
          <Users size={48} color="var(--border)" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "var(--muted)" }}>Nenhum paciente encontrado</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16 }}>
          {filtered.map(p => <PacienteCard key={p.id} paciente={p} />)}
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
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Cadastrar Paciente</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Nome">
                <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} style={inputStyle} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Idade"><input type="number" value={form.idade} onChange={e => setForm({...form, idade: e.target.value})} style={inputStyle} /></Field>
                <Field label="Telefone"><input value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} style={inputStyle} /></Field>
              </div>
              <Field label="E-mail"><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Data de Nascimento"><input type="date" value={form.data_nascimento} onChange={e => setForm({...form, data_nascimento: e.target.value})} style={inputStyle} /></Field>
                <Field label="Etapa da Jornada">
                  <select value={form.etapa_jornada} onChange={e => setForm({...form, etapa_jornada: e.target.value as Paciente["etapa_jornada"]})} style={inputStyle}>
                    {journeyOptions.map(j => <option key={j} value={j}>{journeyLabels[j]}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Observações"><input value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})} style={inputStyle} /></Field>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setDialogOpen(false)} style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
                <button onClick={handleCreate} disabled={!form.nome || saving} style={{ ...btnPrimary, flex: 1, opacity: !form.nome ? 0.5 : 1 }}>
                  {saving ? "Salvando..." : "Cadastrar Paciente"}
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
const searchInputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px 10px 36px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)",
  background: "var(--card)", fontSize: 14,
  color: "var(--foreground)", outline: "none",
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
