import { useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function Trailer() {
  const { ytId } = useParams();
  const navigate = useNavigate();
  return (
    <section className="trailer">
      <button type="button" className="back" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      <div className="player">
        <ReactPlayer url={`https://www.youtube.com/watch?v=${ytId}`} playing controls width="100%" height="100%" />
      </div>
    </section>
  );
}
