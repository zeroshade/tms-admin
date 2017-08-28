import React from 'react';
import { List, Datagrid, TextField, Create, Edit, BooleanField, EditButton, DeleteButton } from 'admin-on-rest';
import { TabbedForm, FormTab, TextInput, LongTextInput, NumberInput, BooleanInput } from 'admin-on-rest';
import { required, minValue } from 'admin-on-rest';
import SchedList from './schedArrayInput';
import DateTable from './sched';

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

export const BaseForm = (props) => (
  <TabbedForm submitOnEnter={false} {...props}>
    <FormTab label="Display Info">
      <TextInput source="name" validate={[required]}/>
      <LongTextInput source="description" />
      <BooleanInput source='published' label='Publish Product?' options={{labelPosition: 'right'}} />
      <NumberInput source='tickets' label='Tickets Per Trip' validate={[required, minValue(1)]} />
      <BooleanInput label='Show Tickets Left?' source='show_tickets' options={{labelPosition: 'right'}} />
    </FormTab>
    <FormTab label="Schedule">
      <SchedList source="sched" />
    </FormTab>
    <FormTab label="Exclusions">
      <DateTable source='exclude' superTitle='Excluded Date Table' elStyle={{width: '400px' }} />
    </FormTab>
  </TabbedForm>
)

export const ProductEdit = (props) => (
  <Edit title="Edit product" {...props}>
    <BaseForm />
  </Edit>
);

export const ProductCreate = (props) => (
  <Create {...props}>
    <BaseForm />
  </Create>
);
