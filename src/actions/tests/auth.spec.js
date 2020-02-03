import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../auth';
import * as types from '../../constants/actions';
import fetchMock from 'fetch-mock';
import expect from 'expect'; // You can use any testing library
import { initialState } from '../../reducer/auth';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
jest.mock('react-native-snackbar', () => jest.fn());
jest.mock('@react-native-community/async-storage', () => jest.fn());
jest.mock('redux-persist', () => ({
  persistReducer: jest.fn(),
  persistStore: jest.fn(),
}));
jest.mock('redux', () => ({
  createStore: jest.fn(),
  combineReducers: jest.fn(),
  applyMiddleware: jest.fn(),
}));
describe('async actions', () => {
  afterEach(() => {
    fetchMock.restore();
  });
  it('creates LOGIN', () => {
    fetchMock.getOnce('/auth/sign_in', {
      body: { data: {} },
      headers: { 'content-type': 'application/json' },
    });
    const expectedActions = [
      { type: types.LOGIN },
      {
        type: types.LOGIN_SUCCESS,
        body: {
          data: {
            id: 10,
            email: 'sojan@thoughtwoot.com',
            provider: 'email',
            name: 'Sojan',
            account_id: 1,
            uid: 'sojan@thoughtwoot.com',
            nickname: null,
            pubsub_token: 'ujmkDZU6jMa72XhdJpB56RgA',
            role: 'administrator',
            inviter_id: 1,
            confirmed: true,
          },
        },
      },
      {
        type: types.LOGIN_ERROR,
        body: {
          success: false,
          errors: ['Invalid login credentials. Please try again.'],
        },
      },
    ];
    const store = mockStore(initialState);
    return store
      .dispatch(actions.onLogin({ email: 'kkk@ll.com', password: 'popo' }))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
