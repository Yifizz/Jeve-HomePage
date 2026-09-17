export type Partner = {
  name: string;
  src?: string;
  href?: string;
  logoClass?: string;
};

export type PrincipalPartner = Partner & {
  label: string;
  category: string;
  description: string;
};

const deloitte: PrincipalPartner = {
  name: "Deloitte",
  label: "Deloitte",
  src: "/partners/principal-hd-deloitte.png",
  href: "https://www.deloitte.com/it/it.html",
  logoClass: "partner-logo-compact",
  category: "Consulenza e competenze",
  description:
    "Una delle principali società di consulenza e revisione al mondo, parte delle Big Four. Opera nei settori audit, consulenza, fiscale, legale e tecnologia, offrendo un punto di riferimento per chi vuole avvicinarsi al mondo professionale.",
};

const fiveJes: PrincipalPartner = {
  name: "5JES",
  label: "5JES",
  src: "/partners/principal-5jes-square-v2.png",
  href: "https://jeitaly.org/",
  logoClass: "partner-logo-square",
  category: "Network e formazione",
  description:
    "L’alleanza tra JEVE, JEMP, JECatt, JEST e JEToP. Unisce le Junior Enterprise in occasioni di formazione, confronto e networking, creando connessioni tra giovani talenti e mondo dell’impresa.",
};

const fairPlay: PrincipalPartner = {
  name: "Fair Play Consulting",
  label: "Fair Play Consulting",
  src: "/partners/principal-hd-fairplay-v2.png",
  href: "https://www.fairplayconsulting.com/it/",
  logoClass: "partner-logo-compact",
  category: "Strategia e crescita",
  description:
    "Una realtà di consulenza dedicata all’evoluzione del business. Affianca le imprese nella definizione delle strategie e nei percorsi di sviluppo, mettendo al centro competenze, metodo e risultati.",
};

const forbes: PrincipalPartner = {
  name: "BFC Media S.p.A. — Forbes Next Leaders",
  label: "Forbes Next Leaders",
  src: "/partners/forbes-next-leaders-user.png",
  href: "https://nextleaders.forbes.it/",
  logoClass: "partner-logo-compact partner-logo-black",
  category: "Media e nuove prospettive",
  description:
    "Il progetto Next Leaders di Forbes Italia, parte di BFC Media. Un incontro tra il mondo editoriale e una nuova generazione di professionisti, per dare spazio a idee, talenti e prospettive sul futuro del business.",
};

export const principalPartners = [forbes, deloitte, fairPlay, fiveJes];

export const partners: Partner[] = [
  deloitte,
  fiveJes,
  fairPlay,
  forbes,
  {
    name: "Scientifica VC",
    src: "/partners/scientifica-vc-transparent.png",
    href: "https://scientifica.vc/",
    logoClass: "partner-logo-scientifica",
  },
  {
    name: "CarrieraLab",
    src: "/partners/carriera-lab.png",
    href: "https://www.carrieralab.it/",
  },
  {
    name: "MultiLumix",
    src: "/partners/multilumix-transparent.png",
    href: "https://multilumix.com/",
    logoClass: "partner-logo-black partner-logo-multilumix",
  },
  {
    name: "Amajor S.p.A.",
    src: "/partners/amajor.svg",
    href: "https://www.amajorsb.com/",
  },
  {
    name: "SkillmeUP",
    src: "/partners/skillmeup.png",
    href: "https://www.skillmeuplab.com/it/",
  },
  {
    name: "Gruppo Italia Retail",
    src: "/partners/gruppo-italia-retail-transparent.png",
    href: "https://www.gruppoitaliaretail.it/",
    logoClass: "partner-logo-gir",
  },
  {
    name: "JEENISo",
    src: "/partners/jeeniso.png",
    href: "https://www.jeeniso.com/",
  },
  {
    name: "JuniFEUP",
    src: "/partners/junifeup.webp",
    href: "https://www.junifeup.pt/",
    logoClass: "partner-logo-compact",
  },
  { name: "Tavolo del Triveneto" },
];

export const networkPartners = partners.filter(
  (partner) => !principalPartners.some((main) => main.name === partner.name),
);
