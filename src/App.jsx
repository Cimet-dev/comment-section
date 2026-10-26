import CommentSection from './CommentSection.jsx';

export default function App() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#conversation" aria-label="Relay home">
          <span className="brand-mark" aria-hidden="true">r</span>
          <span>relay</span>
        </a>
        <div className="topbar-meta">
          <span className="live-dot" aria-hidden="true" />
          <span>Product team</span>
          <span className="topbar-divider" />
          <span>Design review</span>
        </div>
        <button className="profile-avatar" type="button" aria-label="Your profile">JD</button>
      </header>

      <section className="conversation" id="conversation" aria-labelledby="page-title">
        <div className="conversation-heading">
          <div>
            <p className="eyebrow">MONDAY, OCTOBER 26</p>
            <h1 id="page-title">The little details</h1>
            <p className="heading-copy">A few thoughts on the new onboarding flow.</p>
          </div>
          <div className="participant-stack" aria-label="4 participants">
            <span className="mini-avatar avatar-lavender">MC</span>
            <span className="mini-avatar avatar-coral">AL</span>
            <span className="mini-avatar avatar-sage">JR</span>
            <span className="participant-count">+1</span>
          </div>
        </div>

        <CommentSection />
        <footer className="conversation-footer">
          <span className="footer-line" />
          <span>That’s the conversation so far</span>
          <span className="footer-line" />
        </footer>
      </section>
      <div className="page-note"><span className="note-spark" aria-hidden="true">✳</span> Good work happens in the details.</div>
    </main>
  );
}