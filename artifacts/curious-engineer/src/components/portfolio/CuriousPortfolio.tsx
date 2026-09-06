import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { TectonicMap } from '@/components/portfolio/TectonicMap';
import { portfolio } from '@/data/portfolio';

function SystemMark() {
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const points = useMemo(() => [
    { x: 50, y: 50, r: 3 },
    { x: 27, y: 30, r: 2 },
    { x: 76, y: 25, r: 2 },
    { x: 84, y: 70, r: 2 },
    { x: 19, y: 73, r: 2 },
    { x: 55, y: 12, r: 1.5 },
  ], []);

  return (
    <div
      className="ce-system-mark"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
      }}
      style={{ '--mark-x': `${cursor.x}%`, '--mark-y': `${cursor.y}%` } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100">
        <path d="M50 50 L27 30 M50 50 L76 25 M50 50 L84 70 M50 50 L19 73 M50 50 L55 12" />
        <path d="M27 30 L76 25 M76 25 L84 70 M84 70 L19 73 M19 73 L27 30" className="ce-mark-faint" />
        {points.map((point) => <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r={point.r} />)}
        <circle cx={cursor.x} cy={cursor.y} r="12" className="ce-mark-cursor" />
      </svg>
      <span>systems are connected</span>
    </div>
  );
}

export function CuriousPortfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePrinciple, setActivePrinciple] = useState('systems');
  const [showMoreNotes, setShowMoreNotes] = useState(false);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.ce-reveal').forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const visibleNotes = showMoreNotes ? portfolio.notes : portfolio.notes.slice(0, 3);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="ce-site">
      <div className="ce-container">
        <header className="ce-topbar">
          <a href="#top" className="ce-logo" data-testid="link-home">{portfolio.identity.name}<span> / 01</span></a>
          <button type="button" className="ce-nav-toggle" aria-expanded={menuOpen} aria-controls="site-navigation" data-testid="button-toggle-navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? 'Close' : 'Index'}
          </button>
          <nav id="site-navigation" className={`ce-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            <a href="#work" data-testid="link-work" onClick={closeMenu}>Work</a>
            <a href="#experiments" data-testid="link-experiments" onClick={closeMenu}>Experiments</a>
            <a href="#notes" data-testid="link-notes" onClick={closeMenu}>Notes</a>
            <a href="#about" data-testid="link-about" onClick={closeMenu}>About</a>
          </nav>
        </header>

        <section id="top" className="ce-hero" aria-labelledby="hero-heading">
          <SystemMark />
          <div className="ce-hero-copy ce-reveal is-visible">
            <span className="ce-eyebrow">{portfolio.identity.eyebrow}</span>
            <h1 id="hero-heading">{portfolio.identity.headline.lead} <em>{portfolio.identity.headline.emphasis}</em></h1>
            <p className="ce-hero-support">{portfolio.identity.support}</p>
          </div>
          <div className="ce-hero-index ce-reveal ce-delay-2 is-visible">
            <strong>Notebook / 2025</strong>
            <span>Independent engineer</span>
             <span>Based in {portfolio.identity.city}</span>
            <span>Available for [good questions]</span>
          </div>
        </section>
      </div>

      <div className="ce-container">
        <hr className="ce-rule" />
        <section id="work" className="ce-section" aria-labelledby="work-heading">
          <div className="ce-section-heading ce-reveal">
            <h2 id="work-heading">Selected work</h2>
            <p>The flagship piece is an attempt to make a complex system feel less like a diagram and more like something you can move through.</p>
          </div>
          <article className="ce-feature ce-reveal ce-delay-1">
            <div className="ce-feature-intro">
              <div>
                <span className="ce-label">01 / PERSONAL PROJECT</span>
                <h3>TECTONIC — <em>how does a planet move?</em></h3>
              </div>
              <div>
                <p className="ce-feature-deck">An interactive exploration of tectonic plates, designed to make geological systems intuitive and explorable.</p>
                <div className="ce-work-meta">
                  <span>Role / <b>Software engineer · builder</b></span>
                  <span>Topics / <b>Data visualization · APIs · interaction</b></span>
                </div>
              </div>
            </div>
            <TectonicMap />
            <div className="ce-case-study" id="tectonic-reflection" aria-label="Tectonic case study outline">
              <div className="ce-case-step"><span>01</span><h4>The question</h4><p>How do you communicate a dynamic geological system through an interface?</p></div>
              <div className="ce-case-step"><span>02</span><h4>The thinking</h4><p>Turn boundaries, movement, and relationships into a visual language a person can inspect.</p></div>
              <div className="ce-case-step"><span>03</span><h4>The engineering</h4><p>Data → Python backend → API → visualization → interaction.</p></div>
              <div className="ce-case-step"><span>04</span><h4>The result</h4><p>A small model that rewards a closer look. Still evolving.</p></div>
            </div>
            <a className="ce-cta-link" href="#tectonic-reflection" data-testid="link-tectonic-case-study">Read the working notes <span aria-hidden="true">↗</span></a>
          </article>

           <div className="ce-placeholder-list" id="professional-work" aria-label="Professional work">
            {portfolio.professionalWork.map((work, index) => (
              <article className={`ce-placeholder-item ce-reveal ce-delay-${Math.min(index + 1, 4)}`} key={work.index} data-testid={`card-professional-work-${index}`}>
                <span className="ce-placeholder-index">{work.index}</span>
                <div><h3>{work.title}</h3><span className="ce-placeholder-company">{work.company}</span></div>
                <p className="ce-placeholder-note">{work.note}</p>
                <span className="ce-placeholder-label">{work.label}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div id="experiments" className="ce-section-alt">
        <div className="ce-container">
          <section className="ce-section" aria-labelledby="experiments-heading">
            <div className="ce-section-heading ce-reveal">
              <h2 id="experiments-heading">Things I build<br /><em>because I'm curious.</em></h2>
              <p>Not a catalogue of skills. More like a shelf of half-formed questions, small tools, and ideas that got interesting.</p>
            </div>
            <div className="ce-experiment-grid">
              {portfolio.experiments.map((experiment, index) => (
                <button type="button" className={`ce-experiment ce-reveal ce-delay-${Math.min(index + 1, 4)}`} key={experiment.number} data-testid={`button-experiment-${experiment.number}`} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                  <span className="ce-experiment-number">{experiment.number}</span>
                  <h3>{experiment.title}</h3>
                  <span className="ce-experiment-tag">{experiment.tag}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="ce-container">
        <section id="notes" className="ce-section" aria-labelledby="notes-heading">
          <div className="ce-section-heading ce-reveal">
            <h2 id="notes-heading">Things I've been thinking about.</h2>
            <p>A notebook for the questions that sit just outside the job description.</p>
          </div>
          <div className="ce-notes-grid" id="notes-list">
            {visibleNotes.map((note, index) => (
              <article className={`ce-note ce-reveal ce-delay-${Math.min(index + 1, 4)}`} key={note.title} data-testid={`card-note-${index}`}>
                <div className="ce-note-meta"><span>{note.category}</span>{note.date}</div>
                <h3>{note.title}</h3>
                <p className="ce-note-copy">{note.copy}</p>
                <span className="ce-note-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
          <button
            type="button"
            className="ce-text-button"
            data-testid="button-toggle-notes"
            aria-expanded={showMoreNotes}
            aria-controls="notes-list"
            onClick={() => setShowMoreNotes((show) => !show)}
          >
            {showMoreNotes ? 'Show fewer notes —' : 'Show all notes +'}
          </button>
        </section>

        <section className="ce-section" aria-labelledby="thinking-heading">
          <div className="ce-principles-layout">
            <div className="ce-principles-intro ce-reveal">
              <span className="ce-label">A SMALL OPERATING SYSTEM</span>
              <h2 id="thinking-heading">How<br />I think.</h2>
              <p>These are not skills on a résumé. They are the questions I bring to a blank page.</p>
            </div>
            <div className="ce-principle-list ce-reveal ce-delay-2">
              {portfolio.principles.map((principle) => {
                const isActive = principle.key === activePrinciple;
                return (
                  <button type="button" className={`ce-principle ${isActive ? 'is-active' : ''}`} key={principle.key} data-testid={`button-principle-${principle.key}`} onClick={() => setActivePrinciple(isActive ? '' : principle.key)} aria-expanded={isActive}>
                    <span className="ce-principle-header"><span className="ce-principle-number">{principle.number}</span><h3>{principle.title}</h3><span className="ce-principle-plus" aria-hidden="true">+</span></span>
                    <span className="ce-principle-statement">{principle.statement}</span>
                    <span className="ce-principle-detail">{principle.detail}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="about" className="ce-section" aria-labelledby="about-heading">
          <div className="ce-about">
            <div className="ce-reveal"><span className="ce-label">A LITTLE CONTEXT</span><h2 id="about-heading">About<br />the person.</h2></div>
            <div className="ce-about-copy ce-reveal ce-delay-2">
              {portfolio.identity.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="ce-links">
                {portfolio.links.map((link) => link.placeholder
                  ? <span className="ce-link-placeholder" key={link.label} aria-disabled="true">{link.label} ↗</span>
                  : <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} data-testid={`link-${link.label.toLowerCase()}`}>{link.label} ↗</a>)}
              </div>
            </div>
          </div>
        </section>

        <section className="ce-section" id="currently" aria-labelledby="currently-heading">
          <div className="ce-currently ce-reveal">
            <h2 id="currently-heading" className="ce-currently-title">Currently</h2>
            {portfolio.currently.map((item) => <div className="ce-currently-cell" key={item.label}><span className="ce-currently-label">{item.label}</span><p>{item.value}</p></div>)}
          </div>
        </section>

        <footer className="ce-footer" id="contact">
          <h2 className="ce-reveal">Still <em>curious.</em></h2>
          <div className="ce-footer-bottom">
            <div className="ce-footer-links">{portfolio.links.map((link) => link.placeholder
              ? <span className="ce-link-placeholder" key={link.label} aria-disabled="true">{link.label}</span>
              : <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} data-testid={`footer-link-${link.label.toLowerCase()}`}>{link.label}</a>)}</div>
             <span className="ce-footer-meta">© {new Date().getFullYear()} / {portfolio.identity.name} / MADE WITH QUESTIONS</span>
          </div>
        </footer>
      </div>
    </main>
  );
}