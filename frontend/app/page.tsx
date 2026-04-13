"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Financeiro from "./components/Financeiro";
import Campanhas from "./components/Campanhas";
import Planos from "./components/Planos";
import Pacientes from "./components/Pacientes";

export default function Home() {
  const [pagina, setPagina] = useState("dashboard");

  const renderizar = () => {
    switch (pagina) {
      case "dashboard": return <Dashboard />;
      case "financeiro": return <Financeiro />;
      case "campanhas": return <Campanhas />;
      case "planos": return <Planos />;
      case "pacientes": return <Pacientes />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active={pagina} onChange={setPagina} />
      <main style={{
        marginLeft: 260, flex: 1,
        padding: "36px 40px",
        background: "var(--bg)",
        minHeight: "100vh"
      }}>
        {renderizar()}
      </main>
    </div>
  );
}