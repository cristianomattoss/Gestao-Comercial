import "./Dashboard.css";

import { useEffect, useState } from "react";
import { carregarFiliais } from "../controllers/filialController";

import EmpresaConfig from "../components/EmpresaConfig";
import FiliaisConfig from "../components/FiliaisConfig";
import UsuariosConfig from "../components/UsuariosConfig";
import Sidebar from "../components/Sidebar";

function Configuracoes({
  usuario,
  onNavigate,
  onLogout,
}) {
  const [filiais, setFiliais] = useState([]);

  useEffect(() => {
    carregarFiliais().then(setFiliais).catch(() => setFiliais([]));
  }, []);
  const [abaAtiva, setAbaAtiva] = useState("filiais");

  return (
    <main className="dashboard-page">
      <Sidebar
        paginaAtiva="configuracoes"
        onNavigate={onNavigate}
        onLogout={onLogout}
        admin
      />

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Configurações</h1>

            <p>Gerencie as informações administrativas</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">A</div>

            <div>
              <strong>Administrador</strong>
              <span>{usuario?.email}</span>
            </div>
          </div>
        </header>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${abaAtiva === "empresa" ? "active" : ""}`}
            onClick={() => setAbaAtiva("empresa")}
          >
            Empresa
          </button>

          <button
            className={`settings-tab ${abaAtiva === "filiais" ? "active" : ""}`}
            onClick={() => setAbaAtiva("filiais")}
          >
            Filiais
          </button>

          <button
            className={`settings-tab ${
              abaAtiva === "usuarios" ? "active" : ""
            }`}
            onClick={() => setAbaAtiva("usuarios")}
          >
            Usuários
          </button>
        </div>

        {abaAtiva === "empresa" && <EmpresaConfig />}

        {abaAtiva === "filiais" && (
          <FiliaisConfig filiais={filiais} setFiliais={setFiliais} />
        )}

        {abaAtiva === "usuarios" && (
          <UsuariosConfig filiais={filiais} usuarioLogado={usuario} />
        )}
      </section>
    </main>
  );
}

export default Configuracoes;
