export const ExampleOrderResponses = {
  createOrderSuccess: {
    status: 'success',
    data: {
      orderId: 1,
      items: [
        { groceryId: 1, quantity: 2 },
        { groceryId: 2, quantity: 1 },
      ],
      totalAmount: 300,
    },
  },
  createOrderError: {
    status: 'error',
    error: 'something went wrong',
  },
  createOrderErrorInvalidGroceryIds: {
    status: 'error',
    error: 'Invalid grocery IDs',
  },
  createOrderErrorInsufficientStock: {
    status: 'error',
    error: 'Insufficient stock',
  },
  findAllOrdersSuccess: {
    status: 'success',
    data: [
      {
        orderId: 1,
        items: [
          { groceryId: 1, quantity: 2 },
          { groceryId: 2, quantity: 1 },
        ],
        totalAmount: 300,
        createdAt: '2024-01-01',
      },
      {
        orderId: 2,
        items: [
          { groceryId: 1, quantity: 1 },
          { groceryId: 3, quantity: 3 },
        ],
        totalAmount: 500,
        createdAt: '2024-01-02',
      },
    ],
  },
  findAllOrdersEmpty: {
    status: 'success',
    data: [],
  },
  findOrderSuccess: {
    status: 'success',
    data: {
      orderId: 1,
      items: [
        { groceryId: 1, quantity: 2 },
        { groceryId: 2, quantity: 1 },
      ],
      totalAmount: 300,
      createdAt: '2024-01-01',
    },
  },
  findOrderError: {
    status: 'error',
    error: 'Order not found',
  },
  updateOrderSuccess: {
    status: 'success',
    data: { status: true },
  },
  deleteOrderSuccess: {
    status: 'success',
    data: { status: true },
  },
  cancelOrderSuccess: {
    status: 'success',
    message: 'Order cancelled successfully',
  },
  cancelOrderError: {
    status: 'error',
    error: 'Order cannot be cancelled. Only pending orders can be cancelled.',
  },
};
