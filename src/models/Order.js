class Order {
  constructor(userId, restaurantData, items, total, address, payment, status = 'delivering', deliveredAt = null) {
    this.userId = userId
    this.restaurantData = restaurantData
    this.date = new Date().toString()
    this.items = items
    this.total = total
    this.address = address
    this.payment = payment
    this.status = status // 'delivering', 'delivered'
    this.deliveredAt = deliveredAt // timestamp dự kiến giao hàng
  }
}

export default Order
