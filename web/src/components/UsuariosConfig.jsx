import { useState } from "react";
import { criarUsuario } from "../controllers/usuarioController";

function UsuariosConfig({ usuarios, setUsuarios, filiais }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("GESTOR");
  const [filial, setFilial] = useState("");

  function cadastrarUsuario() {
    const usuariosAtualizados = criarUsuario(
      usuarios,
      email,
      senha,
      perfil,
      perfil === "GESTOR" ? filial : null,
    );

    setUsuarios(usuariosAtualizados);

    setEmail("");
    setSenha("");
    setPerfil("GESTOR");
    setFilial("");

    setMostrarFormulario(false);
  }

  return (
    <>
      {mostrarFormulario && (
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Novo usuário</h3>
              <p>Cadastre um novo usuário do sistema.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="emailUsuario">E-mail</label>

              <input
                id="emailUsuario"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex.: usuario@empresa.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="senhaUsuario">Senha</label>

              <input
                id="senhaUsuario"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite a senha"
              />
            </div>

            <div className="form-group">
              <label htmlFor="perfilUsuario">Perfil</label>

              <select
                id="perfilUsuario"
                value={perfil}
                onChange={(e) => {
                  setPerfil(e.target.value);
                  setFilial("");
                }}
              >
                <option value="GESTOR">Gestor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            {perfil === "GESTOR" && (
              <div className="form-group">
                <label htmlFor="filialUsuario">Filial</label>

                <select
                  id="filialUsuario"
                  value={filial}
                  onChange={(e) => setFilial(e.target.value)}
                >
                  <option value="">Selecione uma filial</option>

                  {filiais.map((filialItem) => (
                    <option key={filialItem.id} value={filialItem.nome}>
                      {filialItem.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </button>

            <button className="primary-button" onClick={cadastrarUsuario}>
              Cadastrar usuário
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3>Usuários cadastrados</h3>
            <p>Gerencie os usuários do sistema.</p>
          </div>

          <button
            className="primary-button"
            onClick={() => setMostrarFormulario(true)}
          >
            + Novo usuário
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Filial</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={index}>
                <td>{usuario.email}</td>

                <td>
                  {usuario.perfil === "ADMIN" ? "Administrador" : "Gestor"}
                </td>

                <td>{usuario.filial || "Todas as filiais"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UsuariosConfig;
