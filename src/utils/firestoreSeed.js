import { firestore } from '../firebase';
import { collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';


const sampleRestaurants = [
  // {
  //   name: 'Pizza ABC',
  //   description: 'Pizza ngon nhất thành phố',
  //   tags: ['Breakfast', 'Lunch'],
  //   imgUrl: 'https://images.unsplash.com/photo-1548365328-8b6b7c7c7c7c',
  //   logoUrl: 'https://images.unsplash.com/photo-1548365328-8b6b7c7c7c7c?logo',
  //   address: '123 Đường A, Quận 1, TP.HCM',
  //   stars: 4.5,
  //   avgTime: 30,
  //   deliveryCost: 0,
  //   featured: true,
  //   slogan: 'Best pizza in town!',
  //   categories: ['Pizza', 'Pasta', 'Drink'], 
  //   menu: [
  //     {
  //       name: 'Pizza Margherita',
  //       description: 'Pizza truyền thống Ý với phô mai mozzarella và sốt cà chua.',
  //       imgUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  //       price: 10.99,
  //       stars: 4.7,
  //       category: 'Pizza'
  //     },
  //     {
  //       name: 'Spaghetti Carbonara',
  //       description: 'Mì Ý sốt kem trứng và thịt xông khói.',
  //       imgUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a',
  //       price: 8.99,
  //       stars: 4.6,
  //       category: 'Pasta'
  //     },
  //     {
  //       name: 'Coca Cola',
  //       description: 'Nước ngọt có gas mát lạnh.',
  //       imgUrl: 'https://images.unsplash.com/photo-1615190052434-5d8b98d28e35',
  //       price: 1.5,
  //       stars: 4.4,
  //       category: 'Drink'
  //     },
  //     {
  //       name: 'Iced Lemon Tea',
  //       description: 'Trà chanh đá thanh mát.',
  //       imgUrl: 'https://images.unsplash.com/photo-1527169402691-a4c2bfc79c71',
  //       price: 1.2,
  //       stars: 4.6,
  //       category: 'Drink'
  //     },
  //     {
  //       name: 'Orange Juice',
  //       description: 'Nước cam ép tươi nguyên chất, bổ sung vitamin C.',
  //       imgUrl: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bbf',
  //       price: 1.8,
  //       stars: 4.5,
  //       category: 'Drink'
  //     }
  //   ]
  // }
  
  // {
  //   name: 'Bún Bò Huế 24h',
  //   description: 'Đặc sản Huế chính hiệu',
  //   tags: ['Lunch', 'Dinner'],
  //   imgUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  //   logoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?logo',
  //   address: '456 Đường B, Quận 3, TP.HCM',
  //   stars: 4.7,
  //   avgTime: 25,
  //   deliveryCost: 1.5,
  //   featured: false,
  //   slogan: 'Ăn là ghiền!',
  //   categories: ['Bún', 'Soup'],
  //   menu: [
  //     {
  //       name: 'Bún Bò Huế',
  //       description: 'Bún bò Huế truyền thống, nước dùng đậm đà.',
  //       imgUrl: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc',
  //       price: 5.99,
  //       stars: 4.8,
  //       category: 'Bún'
  //     },
  //     {
  //       name: 'Bánh Mì Chả',
  //       description: 'Bánh mì kẹp chả Huế.',
  //       imgUrl: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
  //       price: 2.99,
  //       stars: 4.3,
  //       category: 'Soup'
  //     }
  //   ]
  // },
  // {
  //   name: 'Burger King',
  //   description: 'Burger ngon hảo hạng',
  //   tags: ['Breakfast', 'Dinner'],
  //   imgUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=60',
  //   logoUrl: 'https://plus.unsplash.com/premium_photo-1661876303174-17153a1d7c57?auto=format&fit=crop&w=500&q=60',
  //   address: '789 Đường C, Quận 4, TP.HCM',
  //   stars: 5.0,
  //   avgTime: 40,
  //   deliveryCost: 0.5,
  //   featured: true,
  //   slogan: 'The bestest Burger of all time',
  //   categories: ['Burger', 'Tacos'],
  //   menu: [
  //     {
  //       name: 'Cheese Burger',
  //       description: 'Juicy beef patty with cheddar cheese and pickles',
  //       imgUrl: 'https://images.unsplash.com/photo-1601050690591-56e6b3f74f30?auto=format&fit=crop&w=500&q=60',
  //       price: 5.99,
  //       stars: 4.9,
  //       category: 'Burger'
  //     },
  //     {
  //       name: 'Beef Taco',
  //       description: 'Crispy taco with spicy beef and lettuce',
  //       imgUrl: 'https://images.unsplash.com/photo-1601050690375-4f0eac9a6606?auto=format&fit=crop&w=500&q=60',
  //       price: 3.49,
  //       stars: 4.8,
  //       category: 'Tacos'
  //     }
  //   ]
  // }

  //  {
  //   name: 'Snack Paradise',
  //   description: 'Thiên đường snack giòn tan',
  //   tags: ['Snack'],
  //   imgUrl: 'https://images.unsplash.com/photo-1613145993485-5d8ba38b2b96?auto=format&fit=crop&w=500&q=60',
  //   logoUrl: 'https://images.unsplash.com/photo-1601048268584-93845cbbd2e0?auto=format&fit=crop&w=500&q=60',
  //   address: '101 Đường Snack, TP.HCM',
  //   stars: 4.3,
  //   avgTime: 15,
  //   deliveryCost: 0.2,
  //   featured: false,
  //   slogan: 'Crunch it your way!',
  //   categories: ['Snack'],
  //   menu: [
  //     {
  //       name: 'Doritos Spicy',
  //       description: 'Snack ngô cay nồng kiểu Mỹ',
  //       imgUrl: 'https://images.unsplash.com/photo-1600803907084-d0f6a7f1e319?auto=format&fit=crop&w=500&q=60',
  //       price: 1.99,
  //       stars: 4.6,
  //       category: 'Snack'
  //     },
  //     {
  //       name: 'Lays Original',
  //       description: 'Khoai tây chiên giòn truyền thống',
  //       imgUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=60',
  //       price: 1.49,
  //       stars: 4.4,
  //       category: 'Snack'
  //     }
  //   ]
  // }

  // {
  //   name: 'Sweet Treats Haven',
  //   description: 'A paradise of delightful desserts and sugary joy.',
  //   tags: ['Dessert', 'Candy', 'Cookie', 'Cake', 'Ice Cream'],
  //   imgUrl: 'https://i.pinimg.com/originals/26/d9/39/26d939870a6fcfb47fdf8e885f90d2ff.jpg',
  //   logoUrl: 'https://i.pinimg.com/originals/2d/79/70/2d797026dc0e9876a1d5027c77598d83.jpg',
  //   address: '88 Sugar Lane, Sweet City',
  //   stars: 4.7,
  //   avgTime: 20,
  //   deliveryCost: 0.5,
  //   featured: true,
  //   slogan: 'Life is short, eat dessert first!',
  //   categories: ['Dessert', 'Candy', 'Cookie', 'Cake', 'Ice Cream'], // ✅ ĐÃ SỬA
  //   menu: [
  //     {
  //       name: 'Red Velvet Cupcake Classic',
  //       description: 'Moist red velvet cake topped with rich cream cheese frosting.',
  //       imgUrl: 'https://i.pinimg.com/originals/09/ed/66/09ed66f81421d8a0ee6a4a2b2f11f12c.jpg',
  //       price: 2.5,
  //       stars: 4.8,
  //       category: 'Dessert'
  //     },
  //     {
  //       name: 'French Macarons Mixed Box',
  //       description: 'French almond meringue cookies with assorted creamy fillings.',
  //       imgUrl: 'https://i.pinimg.com/originals/3b/7b/32/3b7b3230f5d839fb4a0a56b9e5f0293d.jpg',
  //       price: 3.2,
  //       stars: 4.7,
  //       category: 'Cookie'
  //     },
  //     {
  //       name: 'Chocolate Chip Cookie Soft-Baked',
  //       description: 'Classic chewy cookie with rich chocolate chips.',
  //       imgUrl: 'https://i.pinimg.com/originals/46/b4/45/46b44509c97d176adac9f37f64737d2a.jpg',
  //       price: 1.99,
  //       stars: 4.5,
  //       category: 'Cookie'
  //     },
  //     {
  //       name: 'Strawberry Cheesecake Slice',
  //       description: 'Creamy cheesecake layered with fresh strawberries and buttery crust.',
  //       imgUrl: 'https://i.pinimg.com/originals/cf/b8/22/cfb82210d72f3db2a86031a84fc9a29d.jpg',
  //       price: 4.5,
  //       stars: 4.9,
  //       category: 'Cake'
  //     },
  //     {
  //       name: 'Cotton Candy Rainbow',
  //       description: 'Fluffy, colorful spun sugar candy that melts in your mouth.',
  //       imgUrl: 'https://i.pinimg.com/originals/f7/0c/31/f70c31cb6f889dd3e0278990c5eec0ee.jpg',
  //       price: 1.25,
  //       stars: 4.3,
  //       category: 'Candy'
  //     },
  //     {
  //       name: 'Classic Vanilla Ice Cream Cup',
  //       description: 'Creamy vanilla ice cream served in a cup.',
  //       imgUrl: 'https://i.pinimg.com/originals/d8/17/8a/d8178a6e17e84d86e05c5d78beee905c.jpg',
  //       price: 2.0,
  //       stars: 4.6,
  //       category: 'Ice Cream'
  //     }
  //   ]
  // }
  


];

export const seedRestaurants = async () => {
  for (const restaurant of sampleRestaurants) {
    try {
      // Kiểm tra nhà hàng đã tồn tại chưa (theo name)
      const q = query(collection(firestore, 'restaurants'), where('name', '==', restaurant.name));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Đã tồn tại, chỉ cập nhật tags, categories, menu nếu chưa có
        const docRef = snapshot.docs[0].ref;
        const data = snapshot.docs[0].data();

        // Thêm tag/category mới nếu chưa có
        const newTags = Array.from(new Set([...(data.tags || []), ...(restaurant.tags || [])]));
        const newCategories = Array.from(new Set([...(data.categories || []), ...(restaurant.categories || [])]));

        // Thêm menu mới nếu chưa có món trùng tên
        const oldMenu = data.menu || [];
        const newMenu = [...oldMenu];
        for (const item of (restaurant.menu || [])) {
          if (!oldMenu.some(m => m.name === item.name)) {
            newMenu.push(item);
          }
        }

        await updateDoc(docRef, {
          tags: newTags,
          categories: newCategories,
          menu: newMenu
        });
        console.log(`Đã cập nhật: ${restaurant.name}`);
      } else {
        // Chưa tồn tại, thêm mới hoàn toàn
        await addDoc(collection(firestore, 'restaurants'), restaurant);
        console.log(`Đã thêm mới: ${restaurant.name}`);
      }
    } catch (error) {
      console.error('Lỗi khi seed:', error);
    }
  }
  console.log('Đã seed xong dữ liệu mẫu!');
};
