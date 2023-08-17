import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {productDetails: '', count: 1, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const updateSimilarProductsData = data => ({
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      style: data.style,
      title: data.title,
      totalReviews: data.total_reviews,
    })

    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updateFetchedData = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        price: fetchedData.price,
        rating: fetchedData.rating,
        similarProducts: fetchedData.similar_products.map(eachProduct =>
          updateSimilarProductsData(eachProduct),
        ),
        title: fetchedData.title,
        totalReviews: fetchedData.total_reviews,
      }
      this.setState({
        productDetails: updateFetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickIncreaseProductCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onClickDecreaseProductCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderProductDetails = () => {
    const {productDetails, count} = this.state
    // console.log(productDetails)
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetails

    return (
      <div className="products-details-container">
        <div>
          <img src={imageUrl} alt="product" className="product-image" />
        </div>
        <div>
          <div className="product-details-view">
            <h1 className="product-heading">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
          </div>
          <div className="reviews">
            <p className="rating-button">
              {rating}
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-image"
              />
            </p>
            <p className="total-reviews"> {totalReviews} Reviews</p>
          </div>
          <p className="product-description">{description}</p>
          <div>
            <h2 className="available-text">
              Available: <p className="available">{availability}</p>
            </h2>
            <h2 className="available-text">
              Brand: <p className="available">{brand}</p>
            </h2>
          </div>

          <hr />

          <div className="product-add-container">
            <button
              type="button"
              className="count-button"
              onClick={this.onClickDecreaseProductCount}
              data-testid="minus"
            >
              <BsDashSquare className="count-icon" />
            </button>
            <p className="count-text">{count}</p>
            <button
              type="button"
              className="count-button"
              onClick={this.onClickIncreaseProductCount}
              data-testid="plus"
            >
              <BsPlusSquare className="count-icon" />
            </button>
          </div>

          <div>
            <button type="button" className="add-to-cart-button">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {productDetails} = this.state
    const {similarProducts} = productDetails
    return similarProducts === undefined ? (
      ''
    ) : (
      <div className="similar-products-container">
        <h1 className="product-heading">Similar Products</h1>
        <ul className="similar-products">
          {similarProducts.map(product => (
            <SimilarProductItem productDetails={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductNotFoundView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view"
      />
      <h1 className="product-not-found">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.onClickContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductAndSimilarProducts = () => (
    <>
      {this.renderProductDetails()}
      {this.renderSimilarProducts()}
    </>
  )

  renderProductDetailsPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductAndSimilarProducts()
      case apiStatusConstants.failure:
        return this.renderProductNotFoundView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductDetailsPage()}
      </>
    )
  }
}
export default ProductItemDetails
