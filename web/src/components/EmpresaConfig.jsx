import { useEffect, useState } from "react";
import { carregarEmpresa, gravarEmpresa } from "../controllers/empresaController";

const CAMPOS = [
  { nome: "razaoSocial", rotulo: "Razão social", placeholder: "Ex.: Comercial Exemplo Ltda", obrigatorio: true },
  { nome: "nomeFantasia", rotulo: "Nome fantasia", placeholder: "Ex.: Mercado Exemplo", obrigatorio: true },
  { nome: "cnpj", rotulo: "CNPJ", placeholder: "00.000.000/0000-00", obrigatorio: true },
  { nome: "inscricaoEstadual", rotulo: "Inscrição estadual" },
  { nome: "endereco", rotulo: "Endereço" },
  { nome: "cidade", rotulo: "Cidade" },
  { nome: "estado", rotulo: "Estado (UF)", placeholder: "RJ", maxLength: 2 },
  { nome: "telefone", rotulo: "Telefone" },
  { nome: "email", rotulo: "E-mail", tipo: "email" },
];

const VAZIO = Object.fromEntries(CAMPOS.map((c) => [c.nome, ""]));

function EmpresaConfig() {
  const [dados, setDados] = useState(VAZIO);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarEmpresa()
      .then((empresa) => {
        if (empresa) {
          setDados(
            Object.fromEntries(
              CAMPOS.map((c) => [c.nome, empresa[c.nome] ?? ""]),
            ),
          );
        }
      })
      .catch((e) => setErro(e.message));
  }, []);

  function alterar(nome, valor) {
    setSucesso("");
    setDados({ ...dados, [nome]: valor });
  }

  async function salvar() {
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      await gravarEmpresa(dados);
      setSucesso("Dados da empresa salvos.");
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <h3>Dados da empresa</h3>
          <p>Informações cadastrais da empresa.</p>
        </div>

        <div className="form-grid">
          {CAMPOS.map((campo) => (
            <div className="form-group" key={campo.nome}>
              <label htmlFor={campo.nome}>
                {campo.rotulo}
                {campo.obrigatorio && " *"}
              </label>

              <input
                id={campo.nome}
                name={campo.nome}
                type={campo.tipo ?? "text"}
                maxLength={campo.maxLength}
                value={dados[campo.nome]}
                onChange={(e) => alterar(campo.nome, e.target.value)}
                placeholder={campo.placeholder}
              />
            </div>
          ))}
        </div>

        {erro && <p className="login-error">{erro}</p>}
        {sucesso && <p>{sucesso}</p>}

        <div className="form-actions">
          <button className="primary-button" onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmpresaConfig;
