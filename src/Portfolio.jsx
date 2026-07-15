import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail,
  ArrowRight,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  Download,
  MapPin,
  Send,
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ----------------------------------------------------------------------------
// Icônes de marque (GitHub / LinkedIn) en SVG inline.
// lucide-react a retiré ces icônes de marque de ses exports ces derniers
// temps (politique liée aux marques déposées) — on les recrée à la main,
// avec la même API (size, className) que les icônes lucide pour rester
// interchangeables dans le reste du composant.
// ----------------------------------------------------------------------------
function GithubIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.79 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.17.69-3.84-1.35-3.84-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.67 5.34-5.21 5.62.41.36.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.79.55A11.03 11.03 0 0 0 23.02 11.52C23.02 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

/**
 * ============================================================================
 * PORTFOLIO — Gloria Ouinsou, Développeuse Full Stack
 * ============================================================================
 * Direction de design (résumé) :
 * - Palette "sombre forêt" (pas un noir pur générique) + accent émeraude
 *   (croissance / impact durable) + touche bleu électrique en accent
 *   secondaire, cohérent avec la demande initiale.
 * - Typo : Space Grotesk (display, géométrique/tech) + Inter (texte) +
 *   JetBrains Mono (labels, tags, extrait de code) → renforce l'identité
 *   "développeuse" sans tomber dans le cliché "terminal noir/vert".
 * - Signature visuelle : une "ligne de pouls" façon graphique de
 *   contributions (commits), utilisée comme séparateur entre sections.
 *   Elle encode une vraie info (régularité / discipline OKR) plutôt que
 *   d'être décorative.
 * - Le Hero évite le template "gros chiffre + dégradé" : à droite, un
 *   mini bloc "code" présente le profil comme un objet JS — clin d'œil
 *   direct au métier plutôt qu'un visuel abstrait.
 * - Dark/Light mode géré via variables CSS + état React (pas de
 *   localStorage — non supporté dans les artifacts Claude).
 * - Chaque projet précise sa nature (personnel / client / académique) via
 *   un badge discret, pour donner du contexte sans surcharger la carte.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// Données du contenu (à adapter facilement : remplace les liens GitHub /
// LinkedIn par les tiens, ajoute des captures d'écran, etc.)
// ----------------------------------------------------------------------------

const PROFILE = {
  name: "Gloria Ouinsou",
  role: "Développeuse Full Stack",
  tagline:
    "Je conçois des produits web fiables et utiles, pensés pour un impact social réel — du besoin métier jusqu'au déploiement.",
  location: "Cotonou, Bénin",
  email: "gracia.ouinsou@gmail.com",
  github: "#", 
  linkedin: "www.linkedin.com/in/gloria-ouinsou-982b2525b", 
  cvUrl: "https://docs.google.com/document/d/1LS5eMvTomVeFSQ6YeD4w31B7Qo3Wh5mu/edit?usp=sharing&ouid=100604547358997680571&rtpof=true&sd=true",
};

// Photo utilisée dans la section "À propos".
// Place ton fichier photo dans le dossier `public/` de ton projet Vite
// (ex: public/photo-gloria.jpg), puis référence-le ici avec un chemin
// commençant par "/" — Vite sert automatiquement tout ce qui est dans
// `public/` à la racine du site, pas besoin d'import.
// Format recommandé : portrait, ratio 4/5 (ex: 800x1000px), .jpg ou .webp,
// compressé (< 300 Ko) pour ne pas ralentir le chargement.
const ABOUT_PHOTO_URL = "/photo-gloria.jpg";

const NAV_LINKS = [
  { id: "about", label: "À propos" },
  { id: "projects", label: "Projets" },
  { id: "skills", label: "Compétences" },
  { id: "contact", label: "Contact" },
];

// Types de projet : détermine le badge affiché sur chaque carte.
// - "personal"  → Projet personnel
// - "client"    → Projet client
// - "academic"  → Projet académique / stage
const PROJECT_TYPES = {
  personal: { label: "Projet personnel", icon: User },
  client: { label: "Projet client", icon: Briefcase },
  academic: { label: "Projet académique", icon: GraduationCap },
};

const PROJECTS = [
  {
    title: "Jobsy",
    type: "personal",
    problem:
      "Application innovante qui a pour ambition de faciliter l'accès à l'emploi des jeunes talents qui ne possèdent pas de diplômes formels. En déplaçant le curseur du CV traditionnel vers les compétences réelles, la plateforme propose un système d'évaluation dynamique basé sur des tests de logique et des mises en situation pratiques pour révéler le potentiel de chaque candidat.",
    tags: ["Next.js", "Laravel", "MySQL", "API REST"],
    link: "#",
  },
  {
    title: "Ahitché",
    type: "client",
    problem:
      "Plateforme web hybride conçue pour libérer les ménages béninois des contraintes de l'approvisionnement quotidien — marqué par l'inflation, l'instabilité des prix et la corvée des marchés bondés — en leur permettant de s'abonner à des formules de paniers de vivres essentiels de qualité, livrées à domicile à un tarif stable et garanti.",
    tags: ["Vue.js", "Express.js", "MVP"],
    link: "#",
  },
  {
    title: "Plateforme Multi-Tenant",
    type: "client",
    problem:
      "Plateforme web multi-tenant moderne, permettant de gérer et de déployer instantanément le site indépendant de chaque filiale du groupe à partir d'un code et d'un CMS uniques.",
    tags: ["Next.js", "Sanity.io", "Multi-tenant"],
    link: "#",
  },
];

const SKILLS = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "Vue.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "PHP", "Laravel", "Symfony", "API RESTful"],
  },
  {
    category: "Outils & Méthodologies",
    items: ["Git", "Docker", "MySQL", "Gestion par objectifs (OKR)", "Travail en équipe agile"],
  },
];

// Graphique "pouls" — hauteurs relatives représentant une activité régulière
// plutôt qu'un motif purement décoratif.
const PULSE_PATTERN = [
  3, 5, 4, 8, 6, 9, 5, 7, 10, 6, 4, 8, 9, 5, 7, 6, 10, 8, 5, 9, 7, 4, 8, 6, 9, 5, 7, 10, 6, 8,
];

// ----------------------------------------------------------------------------
// Hook utilitaire : révèle un élément au scroll (IntersectionObserver natif)
// ----------------------------------------------------------------------------
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// ----------------------------------------------------------------------------
// Composant : Reveal (wrapper d'animation au scroll)
// ----------------------------------------------------------------------------
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      {children}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Composant : PulseDivider (élément signature — séparateur entre sections)
// ----------------------------------------------------------------------------
function PulseDivider({ label }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className="w-full py-10 sm:py-14" aria-hidden="true">
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <div className="flex items-end gap-[3px] h-8">
          {PULSE_PATTERN.map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-[var(--accent)]"
              style={{
                height: visible ? `${h * 3}px` : "2px",
                opacity: visible ? (i % 3 === 0 ? 1 : 0.45) : 0,
                transition: `height 0.5s ease ${i * 18}ms, opacity 0.5s ease ${i * 18}ms`,
              }}
            />
          ))}
        </div>
        {label && (
          <span className="hidden sm:inline font-mono text-[11px] tracking-wide text-[var(--text-muted)] whitespace-nowrap">
            {label}
          </span>
        )}
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Composant : Tag (badge techno)
// ----------------------------------------------------------------------------
function Tag({ children }) {
  return (
    <span className="font-mono text-[11px] leading-none px-2.5 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface)]">
      {children}
    </span>
  );
}

// ----------------------------------------------------------------------------
// Composant : ProjectTypeBadge (Projet personnel / client / académique)
// ----------------------------------------------------------------------------
function ProjectTypeBadge({ type }) {
  const config = PROJECT_TYPES[type];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wide
                 px-2.5 py-1 rounded-full border border-[var(--accent)]/35 bg-[var(--accent)]/10 text-[var(--accent)]"
    >
      <Icon size={11} />
      {config.label}
    </span>
  );
}

// ----------------------------------------------------------------------------
// Composant : ProjectCard
// ----------------------------------------------------------------------------
function ProjectCard({ project, index }) {
  return (
    <Reveal delay={index * 90} className="h-full">
      <article
        className="group h-full flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7
                   transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/60 hover:shadow-[0_12px_40px_-12px_var(--accent-shadow)]"
      >
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-display text-xl sm:text-[22px] font-semibold text-[var(--text)]">
              {project.title}
            </h3>
            <ProjectTypeBadge type={project.type} />
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--text-muted)] mb-5">
            {project.problem}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md w-fit"
        >
          Voir le projet / GitHub
          <ExternalLink
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </article>
    </Reveal>
  );
}

// ----------------------------------------------------------------------------
// Composant principal
// ----------------------------------------------------------------------------
export default function Portfolio() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  // status : "idle" | "loading" | "success" | "error"
  const [formStatus, setFormStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const theme = isDark
    ? {
        "--bg": "#0B1310",
        "--surface": "#101B17",
        "--surface-2": "#16241F",
        "--text": "#F2F5F1",
        "--text-muted": "#93A69B",
        "--border": "#1E2E27",
        "--accent": "#34D399",
        "--accent-strong": "#10B981",
        "--accent-contrast": "#04150E",
        "--accent-2": "#38BDF8",
        "--accent-shadow": "rgba(52,211,153,0.25)",
      }
    : {
        "--bg": "#F7FAF8",
        "--surface": "#FFFFFF",
        "--surface-2": "#EEF3F0",
        "--text": "#0E1B15",
        "--text-muted": "#4B5D54",
        "--border": "#DCE6DF",
        "--accent": "#0D9F6E",
        "--accent-strong": "#0B8B60",
        "--accent-contrast": "#FFFFFF",
        "--accent-2": "#0284C7",
        "--accent-shadow": "rgba(13,159,110,0.18)",
      };

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setFormStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setFormStatus("success");
      setFormState({ name: "", email: "", message: "" });
    } catch (err) {
      setFormStatus("error");
      setErrorMessage(err.message || "Impossible d'envoyer le message. Réessaie plus tard.");
    }
  };

  return (
    <div
      style={theme}
      className="min-h-screen w-full overflow-x-hidden bg-[var(--bg)] text-[var(--text)] font-body antialiased selection:bg-[var(--accent)] selection:text-[var(--accent-contrast)]"
    >
      {/* Polices + styles globaux */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* NAVIGATION                                                       */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollTo("hero")}
            className="font-display font-semibold text-[15px] tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md"
          >
            Gloria<span className="text-[var(--accent)]">.</span>Ouinsou
          </button>

          {/* Nav desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className="font-mono text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsDark((v) => !v)}
              aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)]
                         hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-colors
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="font-mono text-[13px] px-4 py-2 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] font-medium
                         hover:bg-[var(--accent-strong)] transition-colors
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
            >
              Me contacter
            </button>
          </div>

          {/* Bouton mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsDark((v) => !v)}
              aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)]"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)]"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Menu mobile déroulant */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300 border-b border-[var(--border)]"
          style={{ maxHeight: menuOpen ? "260px" : "0px" }}
        >
          <ul className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className="font-mono text-sm text-[var(--text-muted)]"
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => scrollTo("contact")}
                className="font-mono text-sm px-4 py-2 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] font-medium w-fit"
              >
                Me contacter
              </button>
            </li>
          </ul>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section id="hero" className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center min-w-0">
        <Reveal className="min-w-0">
          <p className="font-mono text-[13px] text-[var(--accent)] mb-5 flex items-center gap-2">
            <MapPin size={14} /> {PROFILE.location} — disponible pour de nouvelles missions
          </p>
          <h1 className="font-display font-semibold text-[36px] sm:text-[52px] leading-[1.08] tracking-tight text-[var(--text)] mb-6">
            Développeuse{" "}
            <span className="text-[var(--accent)]">Web Full Stack</span>.
          </h1>
          <p className="text-[17px] sm:text-[18px] leading-relaxed text-[var(--text-muted)] max-w-xl mb-9">
            {PROFILE.tagline} Spécialisée en React, Next.js, Node.js et Laravel, je livre des
            solutions numériques durables.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollTo("projects")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-sm
                         hover:bg-[var(--accent-strong)] transition-all hover:gap-3
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
            >
              Découvrir mes projets <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--border)] text-[var(--text)] font-medium text-sm
                         hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Me contacter
            </button>
            <a
              href={PROFILE.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[var(--text-muted)] font-medium text-sm
                         hover:text-[var(--text)] transition-colors
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-full"
            >
              <Download size={16} /> Voir mon CV
            </a>
          </div>
        </Reveal>

        {/* Bloc "code" — signature du hero */}
        <Reveal delay={150} className="min-w-0 w-full">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden w-full">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="ml-3 font-mono text-[11px] text-[var(--text-muted)]">profil.js</span>
            </div>
            <pre className="font-mono text-[13px] leading-[1.9] p-6 overflow-x-auto max-w-full text-[var(--text-muted)]">
              <code>
                <span className="text-[var(--accent-2)]">const</span> gloria = {"{"}
                {"\n"}  role: <span className="text-[var(--accent)]">"Développeuse Full Stack"</span>,
                {"\n"}  stack: [<span className="text-[var(--accent)]">"React"</span>, <span className="text-[var(--accent)]">"Next.js"</span>, <span className="text-[var(--accent)]">"Node.js"</span>, <span className="text-[var(--accent)]">"Laravel"</span>],
                {"\n"}  focus: [<span className="text-[var(--accent)]">"impact social"</span>, <span className="text-[var(--accent)]">"solutions durables"</span>],
                {"\n"}  methode: <span className="text-[var(--accent)]">"OKR"</span>,
                {"\n"}  basedIn: <span className="text-[var(--accent)]">"Cotonou, Bénin"</span>,
                {"\n"}{"}"};
              </code>
            </pre>
          </div>
        </Reveal>
      </section>

      <PulseDivider label="3+ ans à livrer, itérer, s'améliorer" />

      {/* ---------------------------------------------------------------- */}
      {/* À PROPOS                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-8 sm:py-16 grid md:grid-cols-[0.4fr_0.6fr] gap-10 min-w-0">
        <Reveal>
          {/* Photo de profil — cadre décoratif accent en arrière-plan, cohérent
              avec le style "carte" utilisé ailleurs sur le site (bordure fine,
              coins arrondis). Remplace ABOUT_PHOTO_URL par le chemin réel de
              ta photo (voir commentaire plus bas). */}
          <p className="font-mono text-[13px] text-[var(--accent)] mb-3">À propos</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text)] leading-tight">
            La rigueur comme méthode, l'impact comme boussole.
          </h2>
          <div className="relative w-full max-w-[280px] mt-8">
            <div
              className="absolute -inset-3 rounded-2xl border border-[var(--accent)]/30 -z-10"
              aria-hidden="true"
            />
            <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] aspect-[4/5]">
              <img
                src={ABOUT_PHOTO_URL}
                alt="Portrait de Gloria Ouinsou"
                className="w-full h-full object-cover"
                loading="lazy"
                width="280"
                height="350"
              />
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-5 mt-32 text-[16px] leading-relaxed text-[var(--text-muted)]">
            <p>
              Je concois et développe des applications web pour des secteurs publics et privés au Bénin
              depuis plus de trois ans, du recueil des besoins jusqu'au déploiement. J'aime
              travailler avec une discipline claire : objectifs définis, priorités assumées,
              résultats mesurables — une approche par OKR qui garde chaque projet aligné sur
              ce qui compte vraiment.
            </p>
            <p>
              Ma sensibilité technique — API RESTful, architecture backend, interfaces React
              soignées — est mise au service d'un principe simple : un bon produit numérique
              doit résoudre un vrai problème, rester maintenable, et rester accessible à ceux
              qui l'utilisent au quotidien, quelles que soient leurs contraintes.
            </p>
            <p>
              C'est cette conviction qui m'a menée vers des projets à impact social et des
              solutions numériques durables : des outils pensés pour durer, pas pour
              impressionner.
            </p>
          </div>
        </Reveal>
      </section>

      <PulseDivider />

      {/* ---------------------------------------------------------------- */}
      {/* PROJETS                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-8 sm:py-16">
        <Reveal>
          <p className="font-mono text-[13px] text-[var(--accent)] mb-3">Projets</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text)] mb-3">
            Des problèmes concrets, des solutions livrées.
          </h2>
          <p className="text-[16px] text-[var(--text-muted)] max-w-2xl mb-10">
            Chaque projet part d'un besoin réel — recrutement inclusif, gestion domestique,
            infrastructure partagée — plutôt que d'une techno à démontrer. Le badge en haut de
            chaque carte précise s'il s'agit d'une initiative personnelle ou d'une mission client.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      <PulseDivider />

      {/* ---------------------------------------------------------------- */}
      {/* COMPÉTENCES                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section id="skills" className="max-w-6xl mx-auto px-6 py-8 sm:py-16">
        <Reveal>
          <p className="font-mono text-[13px] text-[var(--accent)] mb-3">Compétences</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text)] mb-10">
            Une stack complète, du navigateur au serveur.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {SKILLS.map((group, i) => (
            <Reveal key={group.category} delay={i * 100}>
              <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h3 className="font-display font-semibold text-lg text-[var(--text)] mb-4">
                  {group.category}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <PulseDivider label="Toujours ouverte à un nouveau défi" />

      {/* ---------------------------------------------------------------- */}
      {/* CONTACT                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-8 sm:py-20 grid lg:grid-cols-[0.45fr_0.55fr] gap-12 min-w-0">
        <Reveal>
          <p className="font-mono text-[13px] text-[var(--accent)] mb-3">Contact</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text)] mb-4 leading-tight">
            Un projet en tête ? Discutons-en.
          </h2>
          <p className="text-[16px] text-[var(--text-muted)] mb-8 max-w-sm">
            Que ce soit pour une mission freelance, un poste full stack ou simplement échanger
            sur un produit tech-for-impact, je réponds rapidement.
          </p>
          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-3 text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md w-fit break-all"
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)]">
                <Mail size={16} />
              </span>
              {PROFILE.email}
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md w-fit"
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)]">
                <GithubIcon size={16} />
              </span>
              GitHub
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md w-fit"
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)]">
                <LinkedinIcon size={16} />
              </span>
              LinkedIn
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          {formStatus === "success" ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col items-start gap-3">
              <CheckCircle2 className="text-[var(--accent)]" size={28} />
              <h3 className="font-display font-semibold text-lg text-[var(--text)]">
                Message envoyé
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                Merci ! Je reviens vers vous très vite à l'adresse indiquée.
              </p>
              <button
                onClick={() => setFormStatus("idle")}
                className="font-mono text-[13px] text-[var(--accent)] mt-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-md"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-5">
              <div>
                <label htmlFor="name" className="block font-mono text-[12px] text-[var(--text-muted)] mb-2">
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  disabled={formStatus === "loading"}
                  value={formState.name}
                  onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)]
                             placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-mono text-[12px] text-[var(--text-muted)] mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  disabled={formStatus === "loading"}
                  value={formState.email}
                  onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)]
                             placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
                  placeholder="vous@exemple.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block font-mono text-[12px] text-[var(--text-muted)] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  disabled={formStatus === "loading"}
                  value={formState.message}
                  onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)]
                             placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none disabled:opacity-60"
                  placeholder="Parlez-moi de votre projet..."
                />
              </div>

              {formStatus === "error" && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-sm
                           hover:bg-[var(--accent-strong)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
              >
                {formStatus === "loading" ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message <Send size={15} />
                  </>
                )}
              </button>
            </form>
          )}
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[12px] text-[var(--text-muted)]">
            © {new Date().getFullYear()} {PROFILE.name} — Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <GithubIcon size={16} />
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <LinkedinIcon size={16} />
            </a>
            <a href={`mailto:${PROFILE.email}`} aria-label="Email" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}