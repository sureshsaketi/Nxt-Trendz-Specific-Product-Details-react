import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, title, brand, rating, price} = productDetails
  return (
    <li className="similar-product">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-image"
      />
      <h1 className="product-tile">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="price-and-rating">
        <p className="similar-product-price">Rs {price}/-</p>
        <button type="button" className="rating-button">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image"
          />
        </button>
      </div>
    </li>
  )
}
export default SimilarProductItem
