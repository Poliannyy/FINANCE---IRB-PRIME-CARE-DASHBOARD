"use client";
import { useEffect, useState } from "react";
import { Search, Filter, ChevronDown, ChevronUp, Plus } from "lucide-react";

const API = "http://localhost:8000";

export default function Financeiro() {
  const [exames, setExames] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [expandido, setExpandido] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API}/api/exames/`)
      .then(r => r.json())
      .then(data => {
        setExames(data);
        const cats = ["Todos", ...Array.from(new Set(data.map((e: any) => e.categoria.nome))) as string[]];
        setCategorias(cats);
      });
  }, []);

  const filtrados = exames.filter((e: any) => {
    const matchBusca = e.nome.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === "Todos" || e.categoria.nome === filtro;
    return matchBusca && matchFiltro;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)" }}>Financeiro</h1>
          <p style={{ color: "var(--text-mid)", marginTop: 4 }}>Tabela de valores de exames e serviços</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--blue)", color: "white", border: "none",
          borderRadius: 10, padding: "10px 20px", fontWeight: 600,
          fontSize: 14, cursor: "pointer"
        }}>
          <Plus size={16} /> Novo Exame
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 10,
          background: "var(--white)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "10px 16px"
        }}>
          <Search size={16} color="var(--text-light)" />
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar exame..."
            style={{ border: "none", outline: "none", flex: 1, fontSize: 14, color: "var(--text)", background: "transparent" }}
          />
        </div>
        <select
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{
            background: "var(--white)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "10px 16px", fontSize: 14,
            color: "var(--text)", cursor: "pointer", outline: "none"
          }}
        >
          {categorias.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ color: "var(--text-mid)", fontSize: 13, marginBottom: 16 }}>
        {filtrados.length} exames encontrados
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtrados.map((e: any) => (
          <div key={e.id} style={{
            background: "var(--white)", borderRadius: "var(--radius)",
            border: "1px solid var(--border)", overflow: "hidden",
            boxShadow: "var(--shadow)"
          }}>
            <div
              onClick={() => setExpandido(expandido === e.id ? null : e.id)}
              style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "18px 24px", cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{e.nome}</span>
                    <span style={{
                      background: "var(--blue-mid)", color: "var(--blue)",
                      fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 99
                    }}>{e.categoria.nome}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--blue)", marginTop: 4, fontWeight: 500 }}>
                    A partir de R$ {Number(e.preco_minimo)?.toFixed(2)}
                  </div>
                </div>
              </div>
              {expandido === e.id ? <ChevronUp size={18} color="var(--text-mid)" /> : <ChevronDown size={18} color="var(--text-mid)" />}
            </div>

            {expandido === e.id && (
              <div style={{ padding: "0 24px 20px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
                  {e.precos.map((p: any) => (
                    <div key={p.plano_id} style={{
                      background: "var(--bg)", borderRadius: 10,
                      padding: "14px 16px", border: "1px solid var(--border)"
                    }}>
                      <div style={{ fontSize: 12, color: "var(--text-mid)", marginBottom: 6 }}>{p.plano_nome}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
                        R$ {Number(p.preco)?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                {e.preparo && (
                  <div style={{ marginTop: 14, fontSize: 13, color: "var(--text-mid)" }}>
                    <span style={{ fontWeight: 600 }}>Preparo: </span>{e.preparo}
                  </div>
                )}
                {e.tempo_resultado && (
                  <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-mid)" }}>
                    <span style={{ fontWeight: 600 }}>Resultado: </span>{e.tempo_resultado}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}