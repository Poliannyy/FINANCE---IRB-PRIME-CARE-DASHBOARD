"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Plus, DollarSign, ChevronDown } from "lucide-react";
import ExameCard from "@/app/components/ExameCard";
import { ExameAPI } from "@/lib/api";

const emptyForm = {
  nome: "", categoria_id: "", descricao: "",
  tempo_resultado: "", preparo: "",
  preco_particular: "", preco_prime_plus: "", preco_prime_essential: "", preco_prime_elite: "",
};

export default function Financeiro() {
  const [exames, setExames] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { 
    async function init() {
      try {
        const [ex, cat] = await Promise.all([ExameAPI.list(), ExameAPI.listCategorias()]);
        setExames(ex);
        setCategorias(cat);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function loadExames() {
    const data = await ExameAPI.list();
    setExames(data);
  }

  const filtered = useMemo(() => exames.filter(e => {
    const matchSearch = e.nome.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "Todos" || e.categoria === categoryFilter;
    return matchSearch && matchCat;
  }), [exames, search, categoryFilter]);

  async function handleCreate() {
    if (!form.nome || !form.categoria_id || !form.preco_particular) {
      alert("Por favor, preencha os campos obrigatórios (Nome, Categoria e Preço Particular)");
      return;
    }
    setSaving(true);
    try {
      await ExameAPI.create({
        nome: form.nome,
        categoria_id: parseInt(form.categoria_id),
        descricao: form.descricao || "Sem descrição",
        tempo_resultado: form.tempo_resultado || "Não informado",
        preparo: form.preparo || "Sem preparo especial",
        preco_particular: parseFloat(form.preco_particular) || 0,
        preco_prime_plus: parseFloat(form.preco_prime_plus) || 0,
        preco_prime_essential: parseFloat(form.preco_prime_essential) || 0,
        preco_prime_elite: parseFloat(form.preco_prime_elite) || 0,
      });
      setDialogOpen(false);
      setForm(emptyForm);
      loadExames();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
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
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{
              padding: "10px 36px 10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              background: "var(--card)", fontSize: 14,
              color: "var(--foreground)", cursor: "pointer",
              appearance: "none", outline: "none",
            }}
          >
            <option value="Todos">Todas Categorias</option>
            {categorias.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
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
          {filtered.map(exame => <ExameCard key={exame.id} exame={exame} />)}
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
            padding: 28, width: "100%", maxWidth: 600,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            maxHeight: "90vh", overflowY: "auto"
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Cadastrar Novo Exame</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Nome do Exame *">
                  <input placeholder="Ex: Hemograma" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} style={inputStyle} />
                </Field>
                <Field label="Categoria *">
                  <select value={form.categoria_id} onChange={e => setForm({...form, categoria_id: e.target.value})} style={inputStyle}>
                    <option value="">Selecione...</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Descrição">
                <input placeholder="Breve descrição do exame" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} style={inputStyle} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Tempo de Resultado">
                  <input placeholder="Ex: 24 horas" value={form.tempo_resultado} onChange={e => setForm({...form, tempo_resultado: e.target.value})} style={inputStyle} />
                </Field>
                <Field label="Preparo">
                  <input placeholder="Ex: Jejum de 8h" value={form.preparo} onChange={e => setForm({...form, preparo: e.target.value})} style={inputStyle} />
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "12px", background: "var(--muted-bg)", borderRadius: "var(--radius-sm)" }}>
                <Field label="IRB Particular (R$) *"><input type="number" value={form.preco_particular} onChange={e => setForm({...form, preco_particular: e.target.value})} style={inputStyle} /></Field>
                <Field label="Prime Plus (R$)"><input type="number" value={form.preco_prime_plus} onChange={e => setForm({...form, preco_prime_plus: e.target.value})} style={inputStyle} /></Field>
                <Field label="Prime Essential (R$)"><input type="number" value={form.preco_prime_essential} onChange={e => setForm({...form, preco_prime_essential: e.target.value})} style={inputStyle} /></Field>
                <Field label="Prime Elite (R$)"><input type="number" value={form.preco_prime_elite} onChange={e => setForm({...form, preco_prime_elite: e.target.value})} style={inputStyle} /></Field>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setDialogOpen(false)} style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
                <button onClick={handleCreate} disabled={saving} style={{ ...btnPrimary, flex: 1 }}>
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
