import { ERole } from 'src/enums/role.enum';

export const InfiniteToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGUtMUBnbWFpbC5jb20iLCJzdWIiOjEsImlhdCI6MTcyNzk3Njc3MSwiZXhwIjoxNzI4MDYzMTcxfQ.3Snl5b33G7l_sk_PrF5R1oMoDINBAPqEOspM-Om7eJw';

export const userSwaggerEntity = {
  id: 100,
  username: 'user100',
  email: 'example-100@gmail.com',
  role: ERole.ADMIN,
  createdAt: '2024-10-03T14:00:27.515Z',
  updatedAt: '2024-10-03T14:00:27.515Z',
  deletedAt: null
};

export const userSwaggerPost = {
  username: userSwaggerEntity.username,
  email: userSwaggerEntity.email,
  role: userSwaggerEntity.role,
};

export const userSwaggerPatch = {
  username: 'user150',
  email: 'example-150@gmail.com',
  role: userSwaggerEntity.role,
};

export const companySwaggerEntity = {
  id: 100,
  title: 'company100',
  service: 'service',
  address: 'address of company',
  capital: 123,
  user: userSwaggerEntity,
  createdAt: '2024-10-03T14:50:02.995Z',
  updatedAt: '2024-10-03T14:50:02.995Z',
  deletedAt: null
};

export const companySwaggerPost = {
  title: companySwaggerEntity.title,
  service: companySwaggerEntity.service,
  address: companySwaggerEntity.address,
  capital: companySwaggerEntity.capital
};

export const companySwaggerPatch = {
  title: 'company150',
  service: 'another service',
  address: 'another address of company',
  capital: 380
};
