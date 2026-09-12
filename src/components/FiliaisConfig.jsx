import { useState } from "react";
import { criarFilial } from "../controllers/filialController";

function FiliaisConfig({ filiais, setFiliais }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nomeFilial, setNomeFilial] = useState("");
  const [cidade, setCidade] = useState("");
  const [gestor, setGestor] = useState("");

  function cadastrarFilial() {
    const filiaisAtualizadas = criarFilial(filiais, nomeFilial, cidade, gestor);

    setFiliais(filiaisAtualizadas);

    setNomeFilial("");
    setCidade("");
    setGestor("");

    setMostrarFormulario(false);
  }

  return (
    <>
      {mostrarFormulario && (
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Nova filial</h3>
              <p>Cadastre uma nova filial no sistema.</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nomeFilial">Nome da filial</label>

                <input
                  id="nomeFilial"
                  name="nomeFilial"
                  type="text"
                  value={nomeFilial}
                  onChange={(e) => setNomeFilial(e.target.value)}
                  placeholder="Ex.: Filial Centro"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cidade">Cidade</label>

                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex.: Rio de Janeiro"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gestor">Gestor</label>

                <input
                  id="gestor"
                  name="gestor"
                  type="text"
                  value={gestor}
                  onChange={(e) => setGestor(e.target.value)}
                  placeholder="Nome do gestor"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                className="secondary-button"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>

              <button className="primary-button" onClick={cadastrarFilial}>
                Cadastrar filial
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3>Filiais cadastradas</h3>
            <p>Gerencie as filiais da empresa.</p>
          </div>

          <button
            className="primary-button"
            onClick={() => setMostrarFormulario(true)}
          >
            + Nova filial
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Filial</th>
              <th>Cidade</th>
              <th>Gestor</th>
            </tr>
          </thead>

          <tbody>
            {filiais.map((filial) => (
              <tr key={filial.id}>
                <td>{filial.nome}</td>
                <td>{filial.cidade}</td>
                <td>{filial.gerente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FiliaisConfig;
