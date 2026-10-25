import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export function StarDisplay({ value, size = 'sm' }) {
  return (
    <span className={`stars stars-${size}`} aria-label={`${value} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <FontAwesomeIcon key={n} icon={faStar} className={n <= Math.round(value) ? 'on' : ''} />
      ))}
    </span>
  );
}

export function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars stars-lg star-input" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className={n <= (hover || value) ? 'on' : ''}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
        >
          <FontAwesomeIcon icon={faStar} />
        </button>
      ))}
    </div>
  );
}
