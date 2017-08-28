import React from 'react';
import { Admin, Resource, Delete } from 'admin-on-rest';
import restClient from './restClient';
import { ProductList, ProductCreate, ProductEdit } from './products';
import { TicketList, TicketCreate, TicketEdit } from './tickets';
import { UserList  } from './users';

import customRoutes from './customRoutes';
import Menu from './menu';

const ProductTitle = ({record}) => {
  return <span>Delete Product {record ? `"${record.name}"` : ''}</span>;
};
const CustomDelete = (props) => (
  <Delete title={<ProductTitle />} {...props} />
);

const App = () => (
    <Admin restClient={restClient} customRoutes={customRoutes} menu={Menu}>
      <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit} remove={CustomDelete} />
      <Resource name="users" list={UserList} />
      <Resource name="tickets" list={TicketList} create={TicketCreate} edit={TicketEdit} />
    </Admin>
);

export default App;
