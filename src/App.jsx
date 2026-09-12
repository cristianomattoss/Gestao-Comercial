import "./App.css";
import { useState } from "react";

import Dashboard from "./views/Dashboard";
import AdminDashboard from "./views/AdminDashboard";
import Vendas from "./views/Vendas";
import Estoque from "./views/Estoque";
import Configuracoes from "./views/Configuracoes";
import { autenticarUsuario } from "./controllers/authController";
import { Usuario } from "./models/Usuario";

function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [pagina, setPagina] = useState("dashboard");

  const usuarios = [
    new Usuario("admin@empresa.com", "123456", "ADMIN"),
    new Usuario("gestor@empresa.com", "123456", "GESTOR", "Filial Centro"),
  ];

  function handleLogin(event) {
    event.preventDefault();

    setErro("");

    const usuarioEncontrado = autenticarUsuario(usuarios, email, senha);

    if (!usuarioEncontrado) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    console.log("Login realizado:", usuarioEncontrado);

    setUsuarioLogado(usuarioEncontrado);
  }

  if (usuarioLogado) {
    if (usuarioLogado.perfil === "ADMIN") {
      if (pagina === "configuracoes") {
        return <Configuracoes usuario={usuarioLogado} onNavigate={setPagina} />;
      }
      return <AdminDashboard usuario={usuarioLogado} onNavigate={setPagina} />;
    }

    if (pagina === "vendas") {
      return <Vendas usuario={usuarioLogado} onNavigate={setPagina} />;
    }

    if (pagina === "estoque") {
      return <Estoque usuario={usuarioLogado} onNavigate={setPagina} />;
    }

    return <Dashboard usuario={usuarioLogado} onNavigate={setPagina} />;
  }

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-brand">
          <div className="brand-icon">🏪</div>

          <h1>Gestão Comercial</h1>

          <p>
            Dados que impulsionam
            <br />
            suas decisões
          </p>

          <div className="brand-line"></div>

          <div className="brand-info">
            <div>
              <strong>Análise</strong>
              <span>Acompanhe o desempenho</span>
            </div>

            <div>
              <strong>Desempenho</strong>
              <span>Consulte seus resultados</span>
            </div>

            <div>
              <strong>Resultados</strong>
              <span>Transforme dados em oportunidades</span>
            </div>
          </div>

          <small>MAIS CONTROLE. MAIS CRESCIMENTO.</small>
        </div>

        <div className="login-form-area">
          <div className="login-form">
            <div className="account-message">
              Não tem uma conta? <span>Fale com o administrador</span>
            </div>

            <h2>Bem-vindo!</h2>
            <p className="subtitle">Acesse sua conta para continuar</p>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {erro && <p className="login-error">{erro}</p>}

              <button type="submit">Entrar →</button>
            </form>

            <div className="security-message">
              🛡️ Seus dados estão protegidos e seguros.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
