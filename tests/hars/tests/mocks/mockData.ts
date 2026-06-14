export const ingredientsResponse = {
  success: true,
  data: [
    {
      _id: 'bun-id',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: '',
      image_mobile: '',
      image_large: ''
    },
    {
      _id: 'main-id',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: '',
      image_mobile: '',
      image_large: ''
    }
  ]
};

export const userResponse = {
  success: true,
  user: {
    email: 'test@test.ru',
    name: 'Test User'
  }
};

export const orderResponse = {
  success: true,
  name: 'burger',
  order: {
    _id: '123',
    status: 'done',
    name: 'burger',
    owner: {
      name: 'Test User',
      email: 'test@test.ru',
      createdAt: '',
      updatedAt: ''
    },
    createdAt: '',
    updatedAt: '',
    number: 12345,
    price: 1679
  }
};