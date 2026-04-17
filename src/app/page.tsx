"use client";
import { useState, useEffect } from "react";
import { DollarSign, Megaphone, Users, Shield, Activity, TrendingUp } from "lucide-react";
import { DashboardAPI } from "@/lib/api";

function StatCard({ icon: Icon, label, value, subtitle, color = "var(--primary)" }: any) {
  return (
    <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:20, boxShadow:"var(--shadow-sm)", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:13, color:"var(--muted)", fontWeight:500 }}>{label}</span>
        <div style={{ width:36, height:36, borderRadius:"var(--radius-sm)", background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div>
        <div style={{ fontSize:28, fontWeight:700, color:"var(--foreground)", lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>{subtitle}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total_exames: 0, campanhas_ativas: 0, total_pacientes: 0, total_planos: 0 });
  const [recentExams, setRecentExams] = useState<any[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [s, exams, camps] = await Promise.all([
          DashboardAPI.getStats(),
          DashboardAPI.getRecentExams(),
          DashboardAPI.getActiveCampaigns()
        ]);
        setStats(s);
        setRecentExams(exams);
        setActiveCampaigns(camps);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 400 }}>
        <div style={{ width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%" }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth:1100 }} className="animate-fade-in">
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:28, fontWeight:700, color:"var(--foreground)" }}>Dashboard</h1>
        <p style={{ color:"var(--muted)", marginTop:4 }}>Visão geral do sistema financeiro</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, marginBottom:32 }}>
        <StatCard icon={DollarSign} label="Exames Cadastrados" value={stats.total_exames} subtitle="Total de exames" color="var(--primary)" />
        <StatCard icon={Megaphone} label="Campanhas Ativas" value={stats.campanhas_ativas} subtitle="Em andamento" color="var(--accent)" />
        <StatCard icon={Users} label="Pacientes" value={stats.total_pacientes} subtitle="Cadastrados" color="#8b5cf6" />
        <StatCard icon={Shield} label="Planos" value={stats.total_planos} subtitle="Ativos no sistema" color="var(--success)" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:24, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <Activity size={18} color="var(--primary)" />
            <span style={{ fontWeight:600, fontSize:15 }}>Exames Recentes</span>
          </div>
          {recentExams.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", padding: "20px 0" }}>Nenhum exame cadastrado</p>
          ) : recentExams.map((exame, i) => (
            <div key={exame.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom: i < recentExams.length-1 ? "1px solid var(--border)" : "none" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>{exame.nome}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{exame.categoria}</div>
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:"var(--primary)" }}>R$ {exame.preco_minimo.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:24, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <TrendingUp size={18} color="var(--accent)" />
            <span style={{ fontWeight:600, fontSize:15 }}>Campanhas Ativas</span>
          </div>
          {activeCampaigns.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", padding: "20px 0" }}>Nenhuma campanha ativa</p>
          ) : activeCampaigns.map(c => (
            <div key={c.id} style={{ padding:14, borderRadius:"var(--radius-sm)", background:"var(--muted-bg)", border:"1px solid var(--border)", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:13, fontWeight:500 }}>{c.nome}</span>
                <span style={{ padding:"3px 10px", borderRadius:20, background:"var(--accent-light)", color:"var(--accent-foreground)", fontSize:11, fontWeight:600 }}>{c.desconto_percentual}% OFF</span>
              </div>
              <p style={{ fontSize:11, color:"var(--muted)", marginTop:4 }}>{c.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
