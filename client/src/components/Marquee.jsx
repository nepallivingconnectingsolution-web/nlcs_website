import Icon from './Icon.jsx';

export default function Marquee({ items }) {
  // Duplicate once so the CSS animation (translateX -50%) loops seamlessly.
  const loop = [...items, ...items];

  return (
    <section className="marquee-sec" aria-hidden="false">
      <div className="marquee-track">
        {loop.map((item, i) => (
          <span className="marquee-item" key={`${item}-${i}`}>
            <Icon name="zap" size={16} />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
