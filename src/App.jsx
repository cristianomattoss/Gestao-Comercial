import "./App.css";

function App() {
  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-brand">
          <div className="brand-icon">🏪</div>

          <h1>Gestão Comercial</h1>

          <p>Dados que impulsionam<br />suas decisões</p>

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
              Não tem uma conta?{" "}
              <span>Fale com o administrador</span>
            </div>

            <h2>Bem-vindo!</h2>
            <p className="subtitle">Acesse sua conta para continuar</p>

            <form>
              <div className="input-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seuemail@empresa.com"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                />
              </div>

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