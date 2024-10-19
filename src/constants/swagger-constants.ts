const updatedAt = { type: 'string', format: 'date-time', example: '2024-10-17T12:00:00Z' };

export const generalProps = (addProps?: object) => ({
  type: 'object',
  properties: {
    id: { type: 'number', example: 1 },
    createdAt: { type: 'string', format: 'date-time', example: '2024-10-17T10:00:00Z' },
    updatedAt: { type: 'string', format: 'date-time', example: '2024-10-17T10:00:00Z' },
    deletedAt: { type: 'null', example: null },
    ...addProps
  }
});

export const getUserResponse = generalProps({
  username: { type: 'string', example: 'john_doe' },
  email: { type: 'string', example: 'example@email.com' },
  role: { type: 'string', example: 'USER' },
  imageId: { type: 'null', example: null }
});

export const updateUserResponse = generalProps({
  updatedAt,
  username: { type: 'string', example: 'robert_patt' },
  email: { type: 'string', example: 'example@email.com' },
  role: { type: 'string', example: 'USER' },
  imageId: { type: 'null', example: null }
});

export const getCompanyResponse = generalProps({
  updatedAt,
  title: { type: 'string', example: 'TechCorp' },
  service: { type: 'string', example: 'Software development' },
  address: { type: 'string', example: '123 Main St, Cityville' },
  capital: { type: 'number', example: 50000 },
  user: getUserResponse,
  imageId: { type: 'null', example: null }
});

export const updateCompanyResponse = generalProps({
  updatedAt,
  title: { type: 'string', example: 'New Title' },
  service: { type: 'string', example: 'Marketing' },
  address: { type: 'string', example: '123 Main St, Italy' },
  capital: { type: 'number', example: 36744 },
  imageId: { type: 'null', example: null }
});

export const getAllResponse = (obj: object) =>  ({
  type: 'object',
  properties: {
    list: { type: 'array', items: obj},
    totalAmount: { type: 'number', example: 10 },
    limit: { type: 'number', example: 1 },
    page: { type: 'number', example: 1 }
  },
});

export const InfiniteToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGUtMUBnbWFpbC5jb20iLCJzdWIiOjEsImlhdCI6MTcyNzk3Njc3MSwiZXhwIjoxNzI4MDYzMTcxfQ.3Snl5b33G7l_sk_PrF5R1oMoDINBAPqEOspM-Om7eJw';
