import React from 'react';
import { List, Datagrid, TextField, Create, BooleanField, SimpleForm, EditButton, TextInput, LongTextInput, DeleteButton } from 'admin-on-rest';
import SchedList from './schedArrayInput';

export const ProductList = (props) => (
    <List {...props}>
      <Datagrid>
        <TextField source="name" />
        <TextField source="description" />
        <BooleanField source="published" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
);

export const ProductCreate = (props) => (
  <Create {...props}>
    <SimpleForm submitOnEnter={false}>
      <TextInput source="name" />
      <LongTextInput source="description" />

      <SchedList source="sched" />
    </SimpleForm>
  </Create>
);
