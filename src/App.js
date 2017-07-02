import React from 'react';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { ProductList, ProductCreate } from './products';
import { UserList  } from './users';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://localhost:3000')}>
      <Resource name="products" list={ProductList} create={ProductCreate} />
      <Resource name="users" list={UserList} />
    </Admin>
);

export default App;
