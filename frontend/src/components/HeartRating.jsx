export const ratingLabels = {
  0: 'SIN VALORAR',
  1: '1 / 5 — NO FUE PARA MÍ',
  2: '2 / 5 — PASABLE',
  3: '3 / 5 — BUEN JUEGO',
  4: '4 / 5 — GRAN EXPERIENCIA',
  5: '5 / 5 — OBRA MAESTRA'
};

export default function HeartRating({ rating, onChange, allowClear = false, size = 24 }) {
  const handleClick = (num) => {
    if (allowClear && rating === num) {
      onChange(0);
    } else {
      onChange(num);
    }
  };

  return (
    <div className="interactive-hearts">
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          type="button"
          className="heart-btn"
          onClick={() => handleClick(num)}
          aria-label={`Calificar con ${num} corazones`}
        >
          <svg
            width={size}
            height={size - 2}
            viewBox="0 0 9 8"
            fill={num <= rating ? '#ff79c6' : '#30363d'}
          >
            <path d="M1 0h2v1h1v1h1V1h1V0h2v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1V0z" />
          </svg>
        </button>
      ))}
    </div>
  );
}