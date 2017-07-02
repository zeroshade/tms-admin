import React from 'react';
import { List, Datagrid, TextField, Create, BooleanField, SimpleForm, EditButton, TextInput, LongTextInput } from 'admin-on-rest';

export const ProductList = (props) => (
    <List {...props}>
      <Datagrid>
        <TextField source="name" />
        <TextField source="description" />
        <BooleanField source="published" />
        <EditButton />
      </Datagrid>
    </List>
);

export const ProductCreate = (props) => (
  <Create {...props}>
    <SimpleForm submitOnEnter={false}>
      <TextInput source="name" />
      <LongTextInput source="description" />
    </SimpleForm>
  </Create>
);
