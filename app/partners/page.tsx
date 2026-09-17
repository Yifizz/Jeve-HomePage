import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { PartnersOrbitHero } from "../../components/PartnersOrbitHero";
import { PartnerLogo } from "../../components/PartnerLogo";
import { networkPartners, principalPartners } from "../../lib/partners";
import { PartnersNetworkWall } from "../../components/PartnersNetworkWall";
import { PartnerTextReveal } from "../../components/PartnerTextReveal";
import "./partners.css";

export const metadata: Metadata = {
  title: "Partner - JEVE",
  description: "I partner di JEVE: Forbes Next Leaders, Deloitte, Fair Play Consulting e 5JES. Recruiting, eventi e comunicazione per una crescita condivisa.",
  openGraph: {
    title: "Partner - JEVE",
    description: "Connessioni tra studenti, professionisti e imprese. Scopri i partner e le opportunità di collaborazione con JEVE.",
    type: "website",
  },
};

const opportunities = [
  {
    id: "recruiting",
    title: "Recruiting",
    headline: "Il talento, più vicino.",
    description: "Entra in contatto con studenti che hanno già messo alla prova le proprie competenze su progetti reali. Un’occasione per incontrare giovani preparati e avvicinarli alla tua realtà.",
  },
  {
    id: "eventi",
    title: "Eventi",
    headline: "Esperienze da condividere.",
    description: "Porta la tua esperienza nel mondo universitario. Workshop e incontri mirati diventano momenti di confronto, formazione e connessione tra la tua società e gli studenti.",
  },
  {
    id: "social-media",
    title: "Social & Media",
    headline: "Una voce nel nostro network.",
    description: "Fai conoscere la tua realtà a una community di giovani. Le collaborazioni sui nostri canali social e media rafforzano la visibilità del brand e costruiscono nuove relazioni.",
  },
];

export default function PartnersPage() {
  return (
    <div className="site-shell partners-page">
      <SiteHeader />
      <noscript><style>{`
        .partner-orbit-pop, .partner-orbit-mobile > div, .partner-engagement-appear { opacity: 1 !important; transform: none !important; }
        .partner-network-wall { height: auto; overflow: visible; mask-image: none; }
        .partner-network-group[data-copy="duplicate"],
        .partner-network-wall::before, .partner-network-wall::after { display: none; }
      `}</style></noscript>
      <main>
        <PartnersOrbitHero />
        <section className="section partner-detail-section" id="partner-principali" aria-labelledby="principal-partners-title">
          <div className="section-heading">
            <div>
              <p className="section-label">I nostri partner principali</p>
              <PartnerTextReveal as="h2" id="principal-partners-title">Insieme, per<br /><em>andare oltre.</em></PartnerTextReveal>
            </div>
            <p>Quattro realtà con cui condividiamo competenze, visione e opportunità. I partner principali della nostra crescita.</p>
          </div>
          <div className="partner-principal-grid">
            {principalPartners.map((partner, i) => (
              <article className="partner-principal-card" id={`partner-principale-${i}`} key={partner.name}>
                <div className="partner-principal-logo"><PartnerLogo partner={partner} /></div>
                <p className="partner-category">{partner.category}</p>
                <h3>{partner.label}</h3>
                <p className="partner-principal-description">{partner.description}</p>
                <a className="text-link" href={partner.href} target="_blank" rel="noreferrer" aria-label={`Visita il sito di ${partner.label}`}>
                  Visita il sito
                </a>
              </article>
            ))}
          </div>
        </section>
        <section className="partner-network-section" aria-labelledby="partner-network-title">
          <div className="section">
            <div className="section-heading">
              <div>
                <p className="section-label">La nostra rete</p>
                <PartnerTextReveal as="h2" id="partner-network-title">Competenze che<br /><em>si incontrano.</em></PartnerTextReveal>
              </div>
              <p>Imprese, realtà professionali e Junior Enterprise: ogni connessione porta nuove prospettive e occasioni di crescita.</p>
            </div>
            <PartnersNetworkWall partners={networkPartners} />
          </div>
        </section>
        <section className="section partner-opportunities-section" id="opportunita" aria-labelledby="partner-opportunities-title">
          <div className="section-heading">
            <div>
              <p className="section-label">Opportunità</p>
              <PartnerTextReveal as="h2" id="partner-opportunities-title">La collaborazione<br /><em>prende forma.</em></PartnerTextReveal>
            </div>
            <p>Tre modi per entrare in relazione con JEVE e il mondo universitario. Troviamo insieme quello più adatto alla tua società.</p>
          </div>
          <div className="partner-opportunities-grid">
            {opportunities.map((opportunity) => (
              <article className="partner-opportunity" id={opportunity.id} key={opportunity.id}>
                <div className="partner-opportunity-topline"><p>{opportunity.title}</p></div>
                <h3>{opportunity.headline}</h3>
                <p>{opportunity.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="contact-section partner-join-section" id="diventa-partner" aria-labelledby="partner-join-title">
          <div className="contact-copy">
            <p className="section-label section-label-light">Diventa partner</p>
            <PartnerTextReveal as="h2" id="partner-join-title">Il prossimo incontro.<br /><em>Una nuova possibilità.</em></PartnerTextReveal>
            <p>Scopri tutte le opportunità che JEVE può offrire alla tua società. Costruiamo insieme una collaborazione che generi valore per entrambi.</p>
            <a className="button button-light" href="mailto:info@jeve.it?subject=Partnership%20con%20JEVE">Diventa partner</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
