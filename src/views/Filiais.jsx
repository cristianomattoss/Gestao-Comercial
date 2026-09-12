import "./Dashboard.css";

import Sidebar from "../components/Sidebar";
import FiliaisConfig from "../components/FiliaisConfig";
import { getFiliais } from "../services/pdvService";
import { useState } from "react";

function Filiais({ usuario, onLogout }) {
  const [filiais, setFiliais] = useState(getFiliais());

  return (
    <main className="dashboard-page">
      <Sidebar onLogout={onLogout} admin />

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Filiais</h1>

            <p>Consulte e gerencie as filiais da empresa</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {usuario?.email?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>Administrador</strong>
              <span>{usuario?.email}</span>
            </div>
          </div>
        </header>

        <FiliaisConfig filiais={filiais} setFiliais={setFiliais} />
      </section>
    </main>
  );
}

export default Filiais;
