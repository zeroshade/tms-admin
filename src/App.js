import React from 'react';
import { jsonServerRestClient, Admin, Resource, Delete } from 'admin-on-rest';

import { ProductList, ProductCreate } from './products';
import { UserList  } from './users';

const ProductTitle = ({record}) => {
  return <span>Delete Product {record ? `"${record.name}"` : ''}</span>;
};
const CustomDelete = (props) => (
  <Delete title={<ProductTitle />} {...props} />
);

const App = () => (
    <Admin restClient={jsonServerRestClient('http://localhost:3000')}>
      <Resource name="products" list={ProductList} create={ProductCreate} remove={CustomDelete} />
      <Resource name="users" list={UserList} />
    </Admin>
);

export default App;
