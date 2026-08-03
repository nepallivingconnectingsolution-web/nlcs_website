export default function PageLoader() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted-light)',
      }}
    >
      <span className="loader-dot" style={{ transform: 'scale(1.6)' }}>
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}
