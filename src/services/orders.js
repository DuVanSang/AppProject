import { REALTIME_DB_URL, firestore } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

// Lấy các đơn hàng theo email người dùng từ Realtime DB
export const getOrdersFromUser = async email => {
  // Hàm kiểm tra và cập nhật trạng thái đơn hàng nếu đã giao
  const updateOrderStatus = order => {
    if (order.status === 'delivering' && order.deliveredAt && Date.now() >= order.deliveredAt) {
      return { ...order, status: 'delivered' }
    }
    return order
  }

  try {
    const response = await fetch(`${REALTIME_DB_URL}/orders.json`)
    if (!response.ok) {
      throw new Error('Something went wrong!')
    }

    const data = await response.json()

    if (data) {
      const orders = Object.entries(data)
        .filter(([key, order]) => order.userId === email)
        .map(([key, order]) => ({ ...order, id: key }))

      // Cập nhật trạng thái đơn hàng nếu đã giao
      for (const order of orders) {
        if (order.status === 'delivering' && order.deliveredAt && Date.now() >= order.deliveredAt) {
          // Gọi API cập nhật trạng thái trên DB
          await fetch(`${REALTIME_DB_URL}/orders/${order.id}.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'delivered' })
          })
          order.status = 'delivered'
        }
      }
      return orders
    } else {
      return []
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

// Tạo đơn hàng mới
export const createOrder = async order => {
  // Tính thời gian giao dự kiến
  const avgTime = order.restaurantData?.avgTime || 30 // phút
  const now = Date.now()
  order.status = 'delivering'
  order.deliveredAt = now + avgTime * 60 * 1000 // ms

  try {
    // Gửi lên Realtime DB
    await fetch(`${REALTIME_DB_URL}/orders.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })

    // Gửi thêm lên Firestore
    const plainOrder = JSON.parse(JSON.stringify(order));
    console.log('Saving order to Firestore:', plainOrder);

    await addDoc(collection(firestore, 'orders'), plainOrder);
    console.log('Order saved to Firestore successfully');

    return order;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw new Error(error.message);
  }
}

// Xoá đơn hàng theo ID khỏi Realtime DB
export const deleteOrderById = async (orderId) => {
  try {
    const response = await fetch(`${REALTIME_DB_URL}/orders/${orderId}.json`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Không thể xoá đơn hàng!');
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}
