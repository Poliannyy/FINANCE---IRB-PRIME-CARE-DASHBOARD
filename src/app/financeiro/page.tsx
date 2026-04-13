"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Plus, DollarSign, ChevronDown } from "lucide-react";
import ExamCard from "@/components/financeiro/ExamCard";
import { ExamAPI } from "@/lib/api";
import type { Exam } from "@/lib/mockData";

const categories = ["Todos","Laboratorial","Imagem","Cardiologia","Oftalmologia","Ortopedia","Dermatologia","Ginecologia","Urologia","Outros"];

const emptyForm = {
  name: "", category: "Laboratorial", description: "",
  price_particular: "", price_prime_plus: "", price_prime_essential: "", price_prime_elite: "",
};

export default function Financeiro() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadExams(); }, []);

  async function loadExams() {
    const data = await ExamAPI.list();
    setExams(data);
    setLoading(false);
  }

  const filtered = useMemo(() => exams.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todos" || e.category === category;
    return matchSearch && matchCat;
  }), [exams, search, category]);

  async function handleCreate() {
    if (!form.name || !form.price_particular) return;
    setSaving(true);
    await ExamAPI.create({
      name: form.name, category: form.category, description: form.description,
      price_particular: parseFloat(form.price_particular) || 0,
      price_prime_plus: form.price_prime_plus ? parseFloat(form.price_prime_plus) : null,
      price_prime_essential: form.price_prime_essential ? parseFloat(form.price_prime_essential) : null,
      price_prime_elite: form.price_prime_elite ? parseFloat(form.price_prime_elite) : null,
    });
    setDialogOpen(false);
    setForm(emptyForm);
    setSaving(false);
    loadExams();
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
        <div style={{ width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%" }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)" }}>Financeiro</h1>
          <p style={{ color: "var(--muted)", marginTop: 4 }}>Tabela de valores de exames e serviços</p>
        </div>
        <button onClick={() => setDialogOpen(true)} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 18px", borderRadius: "var(--radius-sm)",
          background: "var(--primary)", color: "#fff",
          border: "none", cursor: "pointer",
          fontWeight: 600, fontSize: 14,
          boxShadow: "var(--shadow-sm)",
        }}>
          <Plus size={16} /> Novo Exame
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar exame..."
            style={{
              width: "100%", padding: "10px 12px 10px 36px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--card)", fontSize: 14,
              color: "var(--foreground)", outline: "none",
            }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              padding: "10px 36px 10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--card)", fontSize: 14,
              color: "var(--foreground)", cursor: "pointer",
              appearance: "none", outline: "none",
            }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        {filtered.length} exame{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Exam list */}
      {filtered.length === 0 ? (
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "64px 32px", textAlign: "center",
        }}>
          <DollarSign size={48} color="var(--border)" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "var(--muted)" }}>Nenhum exame encontrado</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(exam => <ExamCard key={exam.id} exam={exam} />)}
        </div>
      )}

      {/* Dialog */}
      {dialogOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }} onClick={e => { if (e.target === e.currentTarget) setDialogOpen(false); }}>
          <div style={{
            background: "var(--card)",
            borderRadius: "var(--radius-lg)",
            padding: 28, width: "100%", maxWidth: 520,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Cadastrar Novo Exame</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Nome do Exame">
                <input placeholder="Ex: Hemograma Completo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
              </Field>
              <Field label="Categoria">
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                  {categories.filter(c => c !== "Todos").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Descrição (opcional)">
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={inputStyle} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="IRB Particular (R$)"><input type="number" value={form.price_particular} onChange={e => setForm({...form, price_particular: e.target.value})} style={inputStyle} /></Field>
                <Field label="Prime Plus (R$)"><input type="number" value={form.price_prime_plus} onChange={e => setForm({...form, price_prime_plus: e.target.value})} style={inputStyle} /></Field>
                <Field label="Prime Essential (R$)"><input type="number" value={form.price_prime_essential} onChange={e => setForm({...form, price_prime_essential: e.target.value})} style={inputStyle} /></Field>
                <Field label="Prime Elite (R$)"><input type="number" value={form.price_prime_elite} onChange={e => setForm({...form, price_prime_elite: e.target.value})} style={inputStyle} /></Field>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setDialogOpen(false)} style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
                <button onClick={handleCreate} disabled={!form.name || !form.price_particular || saving} style={{ ...btnPrimary, flex: 1, opacity: (!form.name || !form.price_particular) ? 0.5 : 1 }}>
                  {saving ? "Salvando..." : "Cadastrar Exame"}
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
  width: "100%", padding: "9px 12px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)",
  background: "var(--background)",
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
