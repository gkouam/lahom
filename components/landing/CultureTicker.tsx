export default function CultureTicker() {
  const items = [
    'Elephant Mask Dance', 'Ndop Royal Cloth', 'Juju Feathered Hats',
    'Beaded Thrones', 'Chefferie Royale', 'Toghu Royal Garment',
    'Nkam Festival', 'Ghomala Language', 'Sacred Forests',
  ]

  const repeated = [...items, ...items]

  return (
    <div className="culture-ticker">
      <div className="ticker-inner">
        {repeated.map((item, i) => (
          <span key={i}><b>◆</b> {item}</span>
        ))}
      </div>
    </div>
  )
}
