"use client";
import "./globals.css";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, DollarSign, Megaphone, Shield, Users, Menu, X
} from "lucide-react";

const navItems = [
  { path: "/",           label: "Dashboard",  icon: LayoutDashboard },
  { path: "/financeiro", label: "Financeiro", icon: DollarSign },
  { path: "/campanhas",  label: "Campanhas",  icon: Megaphone },
  { path: "/planos",     label: "Planos",     icon: Shield },
  { path: "/pacientes",  label: "Pacientes",  icon: Users },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: "rgba(0,0,0,0.15)" }} onClick={onClose} />
      )}
      <aside style={{ position:"fixed", top:0, left:0, zIndex:50, height:"100vh", width:260, background:"var(--card)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", transform: open ? "translateX(0)" : "translateX(-100%)", transition:"transform 0.25s ease" }} className="lg:translate-x-0 lg:sticky">
        <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"var(--primary)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:18 }}>I</div>
            <div>
              <div style={{ fontWeight:600, fontSize:14 }}>IRB Prime Care</div>
              <div style={{ fontSize:11, color:"var(--muted)", marginTop:1 }}>Finance System</div>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"12px", display:"flex", flexDirection:"column", gap:2 }}>
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = pathname === path;
            return (
              <Link key={path} href={path} onClick={onClose} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:"var(--radius-sm)", fontSize:14, fontWeight: active ? 500 : 400, textDecoration:"none", color: active ? "#fff" : "var(--muted)", background: active ? "var(--primary)" : "transparent", transition:"all 0.15s ease" }}>
                <Icon size={18} />{label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding:"12px 16px", borderTop:"1px solid var(--border)" }}>
          <div style={{ padding:"10px 12px", borderRadius:"var(--radius-sm)", background:"var(--muted-bg)" }}>
            <div style={{ fontSize:11, color:"var(--muted)" }}>IRB Prime Care Finance</div>
            <div style={{ fontSize:10, color:"var(--muted)", opacity:0.6, marginTop:2 }}>v1.0.0</div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ display:"flex", minHeight:"100vh" }}>
          <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" }}>
            <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderBottom:"1px solid var(--border)", background:"var(--card)" }} className="lg:hidden">
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:"var(--primary)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:14 }}>I</div>
                <span style={{ fontWeight:600, fontSize:14 }}>IRB Prime Care</span>
              </div>
              <button onClick={() => setMobileOpen(!mobileOpen)} style={{ padding:8, borderRadius:"var(--radius-sm)", border:"none", background:"transparent", cursor:"pointer" }}>
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </header>
            <main style={{ flex:1, padding:"24px 32px", overflowY:"auto" }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}