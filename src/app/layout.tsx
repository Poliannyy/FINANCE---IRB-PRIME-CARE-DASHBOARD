"use client";
import "./globals.css";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, DollarSign, Megaphone, Shield, Menu, X, ChevronLeft
} from "lucide-react";

const navItems = [
  { path: "/",           label: "Dashboard",  icon: LayoutDashboard },
  { path: "/financeiro", label: "Financeiro", icon: DollarSign },
  { path: "/campanhas",  label: "Campanhas",  icon: Megaphone },
  { path: "/planos",     label: "Planos",     icon: Shield },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {/* Overlay para mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.3)" }}
          onClick={onClose}
        />
      )}
      
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          height: "100vh",
          width: 260,
          background: "var(--card)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
        className="lg:translate-x-0" // No desktop ela sempre respeita o transform via JS
      >
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>I</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>IRB Prime Care</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>Finance System</div>
            </div>
          </div>
          {/* Botão de fechar visível apenas no mobile ou quando aberto */}
          <button onClick={onClose} className="lg:hidden" style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: "var(--radius-sm)",
                  fontSize: 14, fontWeight: active ? 500 : 400,
                  textDecoration: "none",
                  color: active ? "#fff" : "var(--muted)",
                  background: active ? "var(--primary)" : "transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={18} />{label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
          <div style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--muted-bg)" }}>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>IRB Prime Care Finance</div>
            <div style={{ fontSize: 10, color: "var(--muted)", opacity: 0.6, marginTop: 2 }}>v1.0.0</div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <html lang="pt-BR">
      <head>
        <title>IRB Prime Care - Financeiro</title>
      </head>
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div 
            style={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              minHeight: "100vh", 
              marginLeft: sidebarOpen ? 260 : 0,
              transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              width: "100%"
            }}
          >
            {/* Header Fixo no Topo */}
            <header
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "12px 24px", 
                borderBottom: "1px solid var(--border)", 
                background: "var(--card)",
                height: "64px",
                position: "sticky",
                top: 0,
                zIndex: 40
              }}
            >
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                style={{ 
                  padding: 8, 
                  borderRadius: "var(--radius-sm)", 
                  border: "1px solid var(--border)", 
                  background: "var(--card)", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--foreground)",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
              </button>
              
              <div style={{ marginLeft: 16, fontWeight: 500, color: "var(--muted)" }}>
                {sidebarOpen ? "" : "IRB Prime Care"}
              </div>
            </header>

            <main style={{ flex: 1, padding: "24px 32px", overflowY: "auto", width: "100%" }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}