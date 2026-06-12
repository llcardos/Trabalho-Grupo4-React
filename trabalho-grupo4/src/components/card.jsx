function Card({ items = [], keyExtractor, renderItem, className = "carditem" }) {
  return (
    <>
      {items.map((item, index) => (
        <article
          className={className}
          key={keyExtractor ? keyExtractor(item, index) : item.id ?? index}
        >
          {renderItem(item, index)}
        </article>
      ))}
    </>
  )
}

export default Card
