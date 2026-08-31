export default function SystemArt({ num }: { num: string }) {
  return (
    <div className="system-art" aria-hidden="true">
      <div className="ring" />
      <div className="core" />
      <span className="art-label">SYSTEM / {num}</span>
    </div>
  );
}

