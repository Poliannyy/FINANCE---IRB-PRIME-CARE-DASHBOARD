"use client";
import { useState, useEffect } from "react";
import { DollarSign, Megaphone, Users, Shield, Activity, TrendingUp } from "lucide-react";

const examesData = [
  { id:"1", nome:"Hemograma Completo", categoria:"Laboratorial", preco_particular:85 },
  { id:"2", nome:"Glicemia em Jejum", categoria:"Laboratorial", preco_particular:35 },
  { id:"3", nome:"Ultrassom Abdominal", categoria:"Imagem", preco_particular:280 },
  { id:"4", nome:"Eletrocardiograma", categoria:"Cardiologia", preco_particular:150 },
  { id:"5", nome:"Raio-X Tórax", categoria:"Imagem", preco_particular:120 },
];

const campanhasData = [
  { id:"1", nome:"Check-up de Inverno", descricao:"Pacote completo de exames laboratoriais com desconto especial na temporada de inverno", desconto_percentual:25 },
  { id:"2", nome:"Campanha Coração Saudável", descricao:"Exames cardiológicos com desconto para prevenção cardiovascular", desconto_percentual:20 },
  { id:"3", nome:"Promoção Imagem Digital", descricao:"Exames de imagem com tecnologia de ponta", desconto_percentual:15 },
];

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
  return (
    <div style={{ maxWidth:1100 }}>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:28, fontWeight:700, color:"var(--foreground)" }}>Dashboard</h1>
        <p style={{ color:"var(--muted)", marginTop:4 }}>Visão geral do sistema financeiro</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, marginBottom:32 }}>
        <StatCard icon={DollarSign} label="Exames Cadastrados" value={15} subtitle="Total de exames" color="var(--primary)" />
        <StatCard icon={Megaphone} label="Campanhas Ativas" value={3} subtitle="Em andamento" color="var(--accent)" />
        <StatCard icon={Users} label="Pacientes" value={6} subtitle="Cadastrados" color="#8b5cf6" />
        <StatCard icon={Shield} label="Planos" value="4" subtitle="IRB, Plus, Essential, Elite" color="var(--success)" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:24, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <Activity size={18} color="var(--primary)" />
            <span style={{ fontWeight:600, fontSize:15 }}>Exames Recentes</span>
          </div>
          {examesData.map((exame, i) => (
            <div key={exame.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom: i < examesData.length-1 ? "1px solid var(--border)" : "none" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>{exame.nome}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{exame.categoria}</div>
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:"var(--primary)" }}>R$ {exame.preco_particular.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:24, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <TrendingUp size={18} color="var(--accent)" />
            <span style={{ fontWeight:600, fontSize:15 }}>Campanhas Ativas</span>
          </div>
          {campanhasData.map(c => (
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
