import React from 'react';
import { List, Edit, Create, Datagrid, EditButton } from 'admin-on-rest';
import { TextField, NumberField } from 'admin-on-rest';
import { SimpleForm, TextInput, NumberInput } from 'admin-on-rest';

export const TicketList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source='name' />
      <NumberField source='adult' options={{ style: 'currency', currency: 'USD'}} />
      <NumberField source='child' options={{ style: 'currency', currency: 'USD'}} />
      <NumberField source='senior' options={{ style: 'currency', currency: 'USD'}} />
      <EditButton />
    </Datagrid>
  </List>
)

export const BaseForm = (props) => (
  <SimpleForm submitOnEnter={false} {...props}>
    <TextInput source='name' />
    <NumberInput source='adult' label='Adult Ticket Price' />
    <NumberInput source='child' label='Child Ticket Price' />
    <NumberInput source='senior' label='Senior Ticket Price' />
  </SimpleForm>
)

export const TicketEdit = (props) => (
  <Edit title='Edit Ticket Category' {...props}>
    <BaseForm />
  </Edit>
);

export const TicketCreate = (props) => (
  <Create {...props}>
    <BaseForm />
  </Create>
);
