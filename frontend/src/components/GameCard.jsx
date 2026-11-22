export default function GameCard({ game, onClick }) {
  return (
    <div
      className={`game-card ${game.id === 1 ? 'card-active' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="game-image-container">
        <span className={`game-status-badge status-${game.status.toLowerCase()}`}>
          {game.status}
        </span>
        <img src={game.image} alt={game.title} className="game-image" />
        {game.id === 1 && (
          <div className="edit-overlay">EDITAR DATOS DE GUARDADO ↗</div>
        )}
      </div>

      <div className="game-info">
        <h3 className="game-title">{game.title}</h3>
        <p className="game-meta">
          {game.year} - {game.genre}
        </p>
        <div className="game-footer">
          <div className="game-hearts">
            {Array.from({ length: game.hearts || 0 }).map((_, i) => (
              <span className="heart-icon" key={i}>
                ♥
              </span>
            ))}
          </div>
          <span className="game-hours">{game.hours}</span>
        </div>
      </div>
    </div>
  );
}