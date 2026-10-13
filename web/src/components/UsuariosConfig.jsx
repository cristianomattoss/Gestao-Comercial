import { useEffect, useState } from "react";
import {
  carregarUsuarios,
  criarUsuario,
  definirSituacao,
} from "../controllers/usuarioController";

function UsuariosConfig({ filiais, usuarioLogado }) {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarUsuarios()
      .then(setUsuarios)
      .catch((e) => setErro(e.message));
  }, []);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("GESTOR");
  const [filial, setFilial] = useState("");

  async function cadastrarUsuario() {
    setErro("");
    setSalvando(true);

    try {
      const novoUsuario = await criarUsuario(email, senha, perfil, filial);

      setUsuarios([...usuarios, novoUsuario]);

      setEmail("");
      setSenha("");
      setPerfil("GESTOR");
      setFilial("");

      setMostrarFormulario(false);
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function alternarSituacao(usuario) {
    setErro("");

    try {
      const atualizado = await definirSituacao(usuario.id, !usuario.ativo);

      setUsuarios(usuarios.map((u) => (u.id === atualizado.id ? atualizado : u)));
    } catch (e) {
      setErro(e.message);
    }
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
                    <option key={filialItem.id} value={filialItem.id}>
                      {filialItem.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {erro && <p className="login-error">{erro}</p>}

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </button>

            <button
              className="primary-button"
              onClick={cadastrarUsuario}
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Cadastrar usuário"}
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

        {!mostrarFormulario && erro && <p className="login-error">{erro}</p>}

        <table className="data-table">
          <thead>
            <tr>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Filial</th>
              <th>Situação</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.email}</td>

                <td>
                  {usuario.perfil === "ADMIN" ? "Administrador" : "Gestor"}
                </td>

                <td>{usuario.filial || "Todas as filiais"}</td>

                <td>{usuario.ativo ? "Ativo" : "Inativo"}</td>

                <td>
                  {usuario.email !== usuarioLogado?.email && (
                    <button
                      className="secondary-button"
                      onClick={() => alternarSituacao(usuario)}
                    >
                      {usuario.ativo ? "Inativar" : "Reativar"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UsuariosConfig;
