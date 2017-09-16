import { GET_ONE, UPDATE, showNotification } from 'admin-on-rest';
import { put, takeEvery } from 'redux-saga/effects';

export const GET_CONFIG = 'GET_CONFIG';
export const UPDATE_CONFIG = 'UPDATE_CONFIG';
export const getConfig = () => ({
  type: GET_CONFIG,
  payload: { id: 'data' },
  meta: { resource: 'config', fetch: GET_ONE, cancelPrevious: false }
});
export const saveConfig = (id, data) => ({
  type: UPDATE_CONFIG,
  payload: { id, data },
  meta: { resource: 'config', fetch: UPDATE, cancelPrevious: false }
});
const defaultState = {
  paypal_email: null,
};

function* notifyUpdate() {
  yield put(showNotification('Saved Config'));
}

export function* configSaga() {
  yield takeEvery('UPDATE_CONFIG_SUCCESS', notifyUpdate);
}

export default (previousState = defaultState, {type, payload }) => {
  switch (type) {
    case 'UPDATE_CONFIG_SUCCESS':
    case 'GET_CONFIG_SUCCESS':
      return payload;
    default:
      return previousState;
  }
};
