export const ExampleResponses = {
  validateGroceryNameSuccess: {
    status: 'success',
    data: { isExists: false },
  },
  validateGroceryNameError: {
    status: 'error',
    error: 'Grocery name already exists',
  },
  createGrocerySuccess: {
    status: 'success',
    data: { id: 1 },
  },
  findAllSuccess: {
    status: 'success',
    data: [
      {
        id: 1,
        name: 'Grocery 1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        price: 100,
        quantity: 100,
      },
      {
        id: 2,
        name: 'Grocery 2',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        price: 200,
        quantity: 200,
      },
    ],
  },
  findOneSuccess: {
    status: 'success',
    data: {
      id: 1,
      name: 'Grocery 1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      price: 100,
      quantity: 100,
    },
  },
  findOneError: {
    status: 'error',
    error: 'Grocery not found',
  },
  updateGrocerySuccess: {
    status: 'success',
    data: { status: true },
  },
  deleteGrocerySuccess: {
    status: 'success',
    data: { status: true },
  },
};
