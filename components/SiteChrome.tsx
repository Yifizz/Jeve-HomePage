import { MobileMenu } from "../app/MobileMenu";

export function SiteHeader({ homePage = false }: { homePage?: boolean }) {
  const home = homePage ? "" : "/";

  return (
    <header className="site-header">
      <a className="brand" href={`${home}#home`} aria-label="JEVE, torna alla homepage">
        <span className="brand-logo" aria-hidden="true">
          <img src="/jeve-red-transparent.png" alt="" />
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Navigazione principale">
        <a href={`${home}#servizi`}>Servizi</a>
        <a href={`${home}#chi-siamo`}>Chi siamo</a>
        <a href="https://jeve.it/entra-in-jeve/" target="_blank" rel="noreferrer">
          Entra in JEVE
        </a>
      </nav>
      <a className="header-cta" href="mailto:info@jeve.it">Contattaci</a>
      <MobileMenu homePrefix={home} />
    </header>
  );
}

export function SiteFooter({ homePage = false }: { homePage?: boolean }) {
  const home = homePage ? "" : "/";

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <a className="brand" href={`${home}#home`} aria-label="JEVE, homepage">
          <span className="brand-logo" aria-hidden="true">
            <img src="/jeve-red-transparent.png" alt="" />
          </span>
          <span className="brand-copy">
            <strong>JEVE</strong>
            <small>Junior Enterprise Venezia</small>
          </span>
        </a>
        <p>Step into the future of your business.</p>
      </div>
      <div className="footer-column">
        <h3>Esplora</h3>
        <a href={`${home}#servizi`}>Servizi</a>
        <a href="/partners/">Partner</a>
        <a href={`${home}#chi-siamo`}>Chi siamo</a>
        <a href={`${home}#riconoscimenti`}>Riconoscimenti</a>
        <a href="https://jeve.it/entra-in-jeve/" target="_blank" rel="noreferrer">
          Entra in JEVE
        </a>
      </div>
      <div className="footer-column">
        <h3>Seguici</h3>
        <a href="https://it.linkedin.com/company/jeve-junior-enterprise-venezia" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="https://www.instagram.com/jeve.venezia/" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="mailto:info@jeve.it">Email</a>
      </div>
      <div className="footer-column footer-address">
        <h3>Venezia</h3>
        <p>
          Cannaregio 2978<br />
          30121 Venezia, VE<br />
          +39 391 720 8715<br /><br />
          P.IVA: 04548570276<br />
          C.F.: 94096850279
        </p>
      </div>
      <div className="footer-bottom">
        <span>© 2026 JEVE</span>
        <span>Junior Enterprise Ca’ Foscari Venezia</span>
        <div>
          <a href="https://jeve.it/privacy-policy/" target="_blank" rel="noreferrer">Privacy</a>
          <a href="https://jeve.it/cookie-policy/" target="_blank" rel="noreferrer">Cookie</a>
        </div>
      </div>
    </footer>
  );
}
