import Icon from './Icon.jsx';

export function ServiceCard({ service, index }) {
  return (
    <div className="svc">
      <span className="svc-num">{String(index + 1).padStart(2, '0')}</span>
      <div className="svc-ico">
        <Icon name={service.icon} size={27} />
      </div>
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      {service.features?.length > 0 && (
        <ul className="svc-feat">
          {service.features.slice(0, 4).map((f) => (
            <li key={f}>
              <Icon name="check" size={15} /> {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, text, center, onDark }) {
  return (
    <div className={`sec-head ${center ? 'center' : ''}`}>
      {eyebrow && <span className={`eyebrow ${onDark ? 'on-dark' : ''}`}>{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
