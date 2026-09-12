import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Store } from "lucide-react";

import Dashboard from "./views/Dashboard";
import AdminDashboard from "./views/AdminDashboard";
import Vendas from "./views/Vendas";
import Estoque from "./views/Estoque";
import Configuracoes from "./views/Configuracoes";
import Filiais from "./views/Filiais";
import Comparativo from "./views/Comparativo";
import Relatorios from "./views/Relatorios";

import { autenticarUsuario } from "./controllers/authController";
import { usuariosIniciais } from "./data/usuariosData";
import { ESTADOS } from "./models/AppState";

function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [usuarios, setUsuarios] = useState(usuariosIniciais);

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

  function handleLogout() {
    setUsuarioLogado(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            usuarioLogado ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <main className="login-page">
                <section className="login-container">
                  <div className="login-brand">
                    <div className="brand-icon">
                      <Store size={40} />
                    </div>

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

                      <p className="subtitle">
                        Acesse sua conta para continuar
                      </p>

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
            )
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            usuarioLogado ? (
              usuarioLogado.perfil === ESTADOS.ADMIN ? (
                <AdminDashboard
                  usuario={usuarioLogado}
                  onLogout={handleLogout}
                />
              ) : (
                <Dashboard usuario={usuarioLogado} onLogout={handleLogout} />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/filiais"
          element={
            usuarioLogado && usuarioLogado.perfil === ESTADOS.ADMIN ? (
              <Filiais usuario={usuarioLogado} onLogout={handleLogout} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* VENDAS */}
        <Route
          path="/vendas"
          element={
            usuarioLogado &&
            (usuarioLogado.perfil === ESTADOS.ADMIN ||
              usuarioLogado.perfil === ESTADOS.GESTOR) ? (
              <Vendas usuario={usuarioLogado} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ESTOQUE */}
        <Route
          path="/estoque"
          element={
            usuarioLogado ? (
              <Estoque usuario={usuarioLogado} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/comparativo"
          element={
            usuarioLogado && usuarioLogado.perfil === ESTADOS.ADMIN ? (
              <Comparativo usuario={usuarioLogado} onLogout={handleLogout} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/relatorios"
          element={
            usuarioLogado ? (
              <Relatorios usuario={usuarioLogado} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* CONFIGURAÇÕES */}
        <Route
          path="/configuracoes"
          element={
            usuarioLogado && usuarioLogado.perfil === ESTADOS.ADMIN ? (
              <Configuracoes
                usuario={usuarioLogado}
                usuarios={usuarios}
                setUsuarios={setUsuarios}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* ROTA PADRÃO */}
        <Route
          path="*"
          element={
            <Navigate to={usuarioLogado ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
