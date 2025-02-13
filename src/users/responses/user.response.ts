export const UserResponses = {
  validateUserSuccess: {
    status: 'success',
    data: { isExists: false },
  },
  validateUserError: {
    status: 'error',
    error: 'User email already exists',
  },
  createUserSuccess: {
    status: 'success',
    data: { id: 1 },
  },
  findUserSuccess: {
    status: 'success',
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        isActive: true,
        role: 'user',
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        isActive: true,
        role: 'user',
      },
    ],
  },
  findOneSuccess: {
    status: 'success',
    data: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      isActive: true,
      role: 'user',
    },
  },
  findOneError: {
    status: 'error',
    error: 'User not found',
  },
  updateUserSuccess: {
    status: 'success',
    data: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      isActive: true,
      role: 'user',
    },
  },
  deleteUserSuccess: {
    status: 'success',
  },
};
