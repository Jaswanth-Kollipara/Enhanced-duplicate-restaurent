import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Category from '../Category'
import Items from '../Items'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    itemList: {},
    apiStatus: apiStatusConstants.initial,
    actCatigory: '11',
    dishCount: [],
    count: 0,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const apiUrl = `https://run.mocky.io/v3/72562bef-1d10-4cf5-bd26-8b0c53460a8e`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.map(product => ({
        restaurantId: product.restaurant_id,
        restaurantName: product.restaurant_name,
        restaurantImage: product.restaurant_image,
        tableId: product.table_id,
        tableName: product.table_name,
        branchName: product.branch_name,
        nexturl: product.nexturl,
        tableMenuList: product.table_menu_list.map(val => ({
          menuCategory: val.menu_category,
          menuCategoryId: val.menu_category_id,
          menuCategoryImage: val.menu_category_image,
          nexturl: val.nexturl,
          categoryDishes: val.category_dishes.map(val1 => ({
            dishId: val1.dish_id,
            dishName: val1.dish_name,
            dishPrice: val1.dish_price,
            dishImage: val1.dish_image,
            dishCurrency: val1.dish_currency,
            dishCalories: val1.dish_calories,
            dishDescription: val1.dish_description,
            dishAvailability: val1.dish_Availability,
            dishType: val1.dish_Type,
            nexturl: val1.nexturl,
            addonCat: val1.addonCat,
          })),
        })),
      }))
      this.setState({
        itemList: updatedData[0],
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeActive = val => {
    this.setState({actCatigory: val})
  }

  increment = id => {
    const {dishCount} = this.state
    const c = dishCount.find(item => item.id === id)
    if (c === undefined) {
      const val = {id, quantity: 1}
      this.setState(prevState => ({
        dishCount: [...prevState.dishCount, val],
        count: prevState.count + 1,
      }))
    } else {
      const updatedCart = dishCount.map(item => {
        if (item.id === id) {
          let {quantity} = item
          quantity += 1
          return {...item, quantity}
        }
        return item
      })
      this.setState(prevState => ({
        dishCount: updatedCart,
        count: prevState.count + 1,
      }))
    }
  }

  decrement = id => {
    const {dishCount} = this.state
    const c = dishCount.find(item => item.id === id)
    if (c === undefined || c.quantity === 0) {
      this.setState({dishCount})
    } else {
      const updatedCart = dishCount.map(item => {
        if (item.id === id) {
          let {quantity} = item
          quantity -= 1
          return {...item, quantity}
        }
        return item
      })
      this.setState(prevState => ({
        dishCount: updatedCart,
        count: prevState.count - 1,
      }))
    }
  }

  renderProductsListView = () => {
    const {itemList, actCatigory, dishCount, count} = this.state
    const categoryList = itemList.tableMenuList.filter(
      item => item.menuCategoryId === actCatigory,
    )
    const [cat] = categoryList
    return (
      <div>
        <div className="main">
          <h1>{itemList.restaurantName}</h1>
          <div className="con-in">
            <p>My Orders</p>
            <p className="pa">{count}</p>
          </div>
        </div>
        <ul className="ul1">
          {itemList.tableMenuList.map(item => (
            <Category
              productDetails={item}
              key={item.menuCategoryId}
              isAct={actCatigory === item.menuCategoryId}
              changeActive={this.changeActive}
            />
          ))}
        </ul>
        <ul className="ul2">
          {cat.categoryDishes.map(item => (
            <Items
              productDetails={item}
              key={item.dishId}
              count={dishCount}
              increment={this.increment}
              decrement={this.decrement}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <h1>Error</h1>
    </div>
  )

  renderAllItems = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderAllItems()}</div>
  }
}

export default Home
