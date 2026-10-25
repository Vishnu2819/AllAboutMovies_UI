import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container-xl py-5 text-center page-top">
      <p className="big-404">404</p>
      <h1 className="page-title">This scene was cut</h1>
      <p className="empty">We couldn't find that page or movie.</p>
      <Link to="/" className="btn-gold">Back to browse</Link>
    </section>
  );
}
