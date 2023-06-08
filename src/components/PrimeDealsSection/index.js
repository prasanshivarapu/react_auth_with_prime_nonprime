import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import ProductCard from '../ProductCard'
import './index.css'

const result = {
  initial: 'initial',
  loader: 'loader',
  final: 'final',
  errorimg: 'errorimg',
}

class PrimeDealsSection extends Component {
  state = {
    primeDeals: [],
    output: result.initial,
  }

  componentDidMount() {
    this.getPrimeDeals()
  }

  getPrimeDeals = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/prime-deals'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      this.setState({output: result.loader})
      const fetchedData = await response.json()
      const updatedData = fetchedData.prime_deals.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        primeDeals: updatedData,
        output: result.final,
      })
    } else if (response.status === 401) {
      this.setState({output: result.errorimg})
    }
  }

  renderPrimeDealsList = () => {
    const {primeDeals} = this.state
    return (
      <div className="products-list-container">
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        <ul className="products-list">
          {primeDeals.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderPrimeDealsFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="Register Prime"
      className="register-prime-image"
    />
  )

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {output} = this.state

    switch (output) {
      case result.final:
        return this.renderPrimeDealsList()
      case result.errorimg:
        return this.renderPrimeDealsFailureView()
      case result.loader:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default PrimeDealsSection
