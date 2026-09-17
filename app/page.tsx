import { HeroWordRotator } from "./HeroWordRotator";
import { HeroScrollController } from "./HeroScrollController";
import { ContactRevealSection } from "./ContactRevealSection";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { AboutBridgeVisual } from "../components/AboutBridgeVisual";
import { AnimatedGroup } from "../components/ui/animated-group";
import { PartnersMarquee } from "./PartnersMarquee";
import { partners } from "../lib/partners";

const services = [
  {
    number: "01",
    title: "Business Analysis",
    description:
      "Processi, business plan, analisi di mercato e dati per trasformare informazioni complesse in decisioni più solide.",
    tags: ["Processi", "Business plan", "Data analytics"],
  },
  {
    number: "02",
    title: "Marketing",
    description:
      "Strategia, campagne e identità di marca per costruire una presenza riconoscibile e creare relazioni con il pubblico.",
    tags: ["Marketing plan", "Social", "Brand identity"],
  },
  {
    number: "03",
    title: "HR",
    description:
      "Ricerca, selezione e valorizzazione dei talenti per aiutare le organizzazioni a costruire team solidi e attrattivi.",
    tags: ["Recruiting", "Employer branding", "Formazione"],
  },
  {
    number: "04",
    title: "IT",
    description:
      "Siti web e sistemi di misurazione che rendono la presenza digitale efficace, leggibile e orientata alla crescita.",
    tags: ["Web development", "Analytics", "Tracking"],
  },
  {
    number: "05",
    title: "Sales & BD",
    description:
      "Percorsi di lead generation mirati per avvicinare aziende e persone realmente interessate a prodotti e servizi.",
    tags: ["Lead generation", "Prospecting", "Sviluppo"],
  },
];

const awards = [
  {
    year: "2026",
    title: "Shared Growth",
    copy: "Riconoscimento alla continuità con cui JEVE genera valore condiviso tra studenti, imprese e network.",
    image: "/awards/shared-growth-2025.png",
  },
  {
    year: "2025",
    title: "Shared Growth",
    copy: "Premio alla Junior Enterprise che crea crescita condivisa tra studenti, imprese e network.",
    image: "/awards/shared-growth-2025.png",
  },
  {
    year: "2025",
    title: "Best Junior Enterprise",
    copy: "Premio alla Junior Enterprise che eccelle per risultati, innovazione e impatto.",
    image: "/awards/best-junior-enterprise-2025.png",
  },
  {
    year: "2024",
    title: "Shared Growth",
    copy: "Premio alla Junior Enterprise che favorisce collaborazione sostenibile e crescita condivisa nel network.",
    image: "/awards/shared-growth-2025.png",
  },
  {
    year: "2023",
    title: "Sustainable Development",
    copy: "Premio alla Junior Enterprise più impegnata in progetti sostenibili e responsabili.",
    image: "/awards/sustainable-development-2023.png",
  },
  {
    year: "2020",
    title: "Best Junior Initiative",
    copy: "Premio alla nuova Junior Enterprise che si distingue per innovazione, impatto e qualità dei progetti.",
    image: "/awards/best-junior-initiative-2020.png",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader homePage />

      <main>
        <HeroScrollController />
        <div className="hero-transition-scene">
          <section className="hero" id="home">
            <div className="hero-depth-field" aria-hidden="true" />

            <div className="hero-copy">
              <p className="eyebrow">Junior Enterprise · Ca’ Foscari Venezia</p>
              <h1>
                <span className="hero-static-line">Costruiamo</span>
                <HeroWordRotator />
              </h1>
              <p className="hero-intro">
                Competenze universitarie, metodo e visione al servizio di imprese
                che vogliono crescere.
              </p>
              <a
                className="button button-red"
                href="https://jeve.it/contattaci/"
                target="_blank"
                rel="noreferrer"
              >
                Richiedi un preventivo
              </a>
            </div>

            <aside className="hero-panel">
              <div>
                <p className="section-label">Cosa facciamo</p>
                <h2>
                  Idee che diventano
                  <br />
                  <em>movimento.</em>
                </h2>
              </div>
              <div className="panel-copy">
                <p>
                  Affianchiamo aziende e realtà del territorio con consulenza
                  manageriale in cinque aree, unendo preparazione accademica e
                  applicazione concreta.
                </p>
                <a href="#servizi">
                  Esplora i servizi
                </a>
              </div>
              <div className="panel-stat">
                <strong>05</strong>
                <span>aree di competenza</span>
              </div>
            </aside>
          </section>
        </div>

        <section className="section services-section" id="servizi">
          <div className="services-scroll-content">
            <div className="section-heading">
              <div>
                <p className="section-label">I nostri servizi</p>
                <h2>
                  Competenze diverse.
                  <br />
                  <em>Un solo obiettivo.</em>
                </h2>
              </div>
              <p>
                Soluzioni su misura per dare struttura alle idee, trovare nuove
                opportunità e leggere con chiarezza ciò che viene dopo.
              </p>
            </div>

            <AnimatedGroup
              className="service-grid"
              preset="blur-slide"
              role="list"
            >
              {services.map((service) => (
                <article
                  className="service-card"
                  key={service.number}
                  role="listitem"
                  tabIndex={0}
                >
                  <div className="service-topline">
                    <span>{service.number}</span>
                    <span className="service-dot" aria-hidden="true" />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul aria-label={`Ambiti ${service.title}`}>
                    {service.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <a
                    href="https://jeve.it/servizi/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Scopri di più su ${service.title}`}
                  >
                    Scopri di più
                  </a>
                </article>
              ))}
            </AnimatedGroup>
          </div>
        </section>

        <section className="partners-section" id="partners">
          <div className="partners-heading">
            <div>
              <p className="section-label">Partner</p>
              <h2>
                La crescita è
                <br />
                <em>condivisa.</em>
              </h2>
            </div>
            <div className="partners-intro">
              <p>
                Collaborazioni che avvicinano studenti, professionisti e
                imprese, creando opportunità concrete per crescere insieme.
              </p>
              <a
                className="text-link"
                href="/partners/"
              >
                Scopri i partner
              </a>
            </div>
          </div>

          <PartnersMarquee partners={partners} />
        </section>

        <section className="about-section" id="chi-siamo">
          <AboutBridgeVisual />
          <div className="about-copy">
            <p className="section-label">Chi siamo</p>
            <h2>
              Il punto d’incontro tra
              <br />
              <em>università e impresa.</em>
            </h2>
            <p className="about-lead">
              JEVE è la Junior Enterprise dell’Università Ca’ Foscari di
              Venezia: una realtà non profit gestita da studenti, nata per
              ridurre la distanza tra studio e lavoro.
            </p>
            <p>
              Lavoriamo su progetti reali insieme ad aziende, enti e
              istituzioni. È così che la preparazione diventa esperienza e che
              ogni collaborazione genera valore per entrambe le parti.
            </p>
            <a
              className="text-link"
              href="https://jeve.it/chi-siamo/"
              target="_blank"
              rel="noreferrer"
            >
              Conosci JEVE
            </a>
          </div>
        </section>

        <section className="section awards-section" id="riconoscimenti">
          <div className="section-heading awards-heading">
            <div>
              <p className="section-label">Premi e riconoscimenti</p>
              <h2>
                Una storia di impegno,
                <br />
                <em>riconosciuta.</em>
              </h2>
            </div>
            <p>
              Dal riconoscimento più recente al primo traguardo: ogni tappa
              racconta la qualità dei progetti e l’impatto costruito nel tempo.
            </p>
          </div>

          <div className="awards-list">
            {awards.map((award, index) => (
              <article className="award-row" key={`${award.year}-${award.title}`}>
                <span className="award-index">0{index + 1}</span>
                <time>
                  {award.year}
                  {index === 0 ? (
                    <span className="award-latest-label">Più recente</span>
                  ) : null}
                </time>
                <span className="award-image">
                  <img
                    src={award.image}
                    alt={`Premio ${award.title} ${award.year}`}
                    loading="lazy"
                  />
                </span>
                <h3>{award.title}</h3>
                <p>{award.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <ContactRevealSection />
      </main>

      <SiteFooter homePage />
    </div>
  );
}
