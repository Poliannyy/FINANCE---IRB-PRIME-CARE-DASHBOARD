"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Users } from "lucide-react";
import PatientCard from "@/components/pacientes/PatientCard";
import { PatientAPI } from "@/lib/api";
import type { Patient } from "@/lib/mockData";

const planOptions = ["IRB Particular", "Prime Plus", "Prime Essential", "Prime Elite"];
const journeyOptions = ["Primeiro Contato", "Avaliação", "Tratamento", "Acompanhamento", "Fidelizado"];
const journeyTabs = ["Todos", ...journeyOptions];

const emptyForm = {
  name: "", age: "", phone: "", email: "",
  plan: "IRB Particular",
  journey_stage: "Primeiro Contato",
  notes: "",
};

export default function Pacientes() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [journeyFilter, setJourneyFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadPatients(); }, []);

  async function loadPatients() {
    const data = await PatientAPI.list();
    setPatients(data);
    setLoading(false);
  }

  const filtered = useMemo(() => patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchJourney = journeyFilter === "Todos" || p.journey_stage === journeyFilter;
    return matchSearch && matchJourney;
  }), [patients, search, journeyFilter]);

  async function handleCreate() {
    if (!form.name) return;
    setSaving(true);
    await PatientAPI.create({
      name: form.name,
      age: form.age ? parseInt(form.age) : 0,
      phone: form.phone,
      email: form.email,
      plan: form.plan,
      journey_stage: form.journey_stage,
      notes: form.notes,
    });
    setDialogOpen(false);
    setForm(emptyForm);
    setSaving(false);
    loadPatients();
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
        <button onClick={() => setDialogOpen(true)} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 18px", borderRadius: "var(--radius-sm)",
          background: "var(--primary)", color: "#fff",
          border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
          boxShadow: "var(--shadow-sm)",
        }}>
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
          style={{
            width: "100%", padding: "10px 12px 10px 36px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
            background: "var(--card)", fontSize: 14,
            color: "var(--foreground)", outline: "none",
          }}
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
          }}>{t}</button>
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
          {filtered.map(p => <PatientCard key={p.id} patient={p} />)}
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
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Idade"><input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={inputStyle} /></Field>
                <Field label="Telefone"><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} /></Field>
              </div>
              <Field label="E-mail"><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Plano">
                  <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} style={inputStyle}>
                    {planOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Jornada">
                  <select value={form.journey_stage} onChange={e => setForm({...form, journey_stage: e.target.value})} style={inputStyle}>
                    {journeyOptions.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Observações"><input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={inputStyle} /></Field>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setDialogOpen(false)} style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
                <button onClick={handleCreate} disabled={!form.name || saving} style={{ ...btnPrimary, flex: 1, opacity: !form.name ? 0.5 : 1 }}>
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
const btnPrimary: React.CSSProperties = {
  padding: "10px 18px", borderRadius: "var(--radius-sm)",
  background: "var(--primary)", color: "#fff",
  border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
};
const btnSecondary: React.CSSProperties = {
  padding: "10px 18px", borderRadius: "var(--radius-sm)",
  background: "var(--muted-bg)", color: "var(--foreground)",
  border: "1px solid var(--border)", cursor: "pointer", fontWeight: 500, fontSize: 14,
};
