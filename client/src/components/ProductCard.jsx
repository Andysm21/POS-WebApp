export default function ProductCard({ product, onAddToCart, isSelected }) {
  return (
    <button
      onClick={() => onAddToCart(product)}
      className={`product-card${isSelected ? " product-card--selected" : ""}`}
      type="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <div className="product-card__content">
        <div className="product-card__img-wrap">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="product-card__img"
            />
          ) : (
            <div className="product-card__img product-card__img--placeholder">
              <span role="img" aria-label="Food" style={{ fontSize: 32 }}>🍽️</span>
            </div>
          )}
        </div>
        <div className="product-card__info">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__price">{product.price.toFixed(2)} L.E.</p>
          {product.stock <= 5 && (
            <span className="product-card__lowstock">
              Low Stock: {product.stock}
            </span>
          )}
        </div>
      </div>
      <style>{`
        .product-card {
          position: relative;
          width: 170px;
          min-height: 210px;
          border: 2px solid #e4e8ed;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 2px 12px #0001;
          display: flex;
          flex-direction: column;
          padding: 0;
          outline: none;
          cursor: pointer;
          transition: border 0.18s, box-shadow 0.18s, transform 0.13s;
        }
        .product-card:focus,
        .product-card:hover {
          border: 2px solid #3db36b;
          box-shadow: 0 4px 16px #3db36b30;
        }
        .product-card:active {
          transform: scale(0.97);
        }
        .product-card--selected {
          border: 2.5px solid #1ca700;
          background: #e7f9ec;
          box-shadow: 0 2px 16px #1ca70030;
          transform: scale(1.045);
        }
        .product-card__content {
          padding: 1.3rem 1rem 1.2rem 1rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 0.7rem;
        }
        .product-card__img-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 0.6rem;
        }
        .product-card__img {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 9px;
          background: #f8fafb;
        }
        .product-card__img--placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f2f5f7;
          color: #bbb;
        }
        .product-card__info {
          text-align: center;
        }
        .product-card__name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.2rem;
          color: #222;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .product-card__price {
          color: #1ca700;
          font-size: 1.17rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }
        .product-card__lowstock {
          display: inline-block;
          background: #ffe8e8;
          color: #c70000;
          font-size: 0.79rem;
          border-radius: 12px;
          padding: 2px 9px;
          margin-top: 0.18rem;
          font-weight: 500;
        }
      `}</style>
    </button>
  );
}