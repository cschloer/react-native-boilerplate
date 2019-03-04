import db from '../database/db';

export const GET_GROUP_META = 'notecarder/group_meta/GET_GROUP_META';
export const GET_GROUP_META_SUCCESS = 'notecarder/group_meta/GET_GROUP_META_SUCCESS';
export const GET_GROUP_META_FAIL = 'notecarder/group_meta/GET_GROUP_META_FAIL';

const defaultState = {
  groupMetaList: [],
  groupMetaLoading: false,
  groupMetaError: false,
};

export default function groupMetaReducer(state = defaultState, action) {
  switch (action.type) {
    case GET_GROUP_META:
      return { ...state, groupMetaLoading: true, groupMetaError: false };
    case GET_GROUP_META_SUCCESS:
      return { ...state, groupMetaLoading: false, groupMetaList: action.data };
    case GET_GROUP_META_FAIL:
      return { ...state, groupMetaLoading: false, groupMetaError: 'There was an error while getting group metadata' };
    default:
      return state;
  }
}

export function getGroupMeta() {
  return {
    type: GET_GROUP_META,
  };
}

export function getGroupMetaSuccess(groupMetaList) {
  return {
    type: GET_GROUP_META_SUCCESS,
    data: groupMetaList,
  };
}

export function getGroupMetaFailure(error) {
  return {
    type: GET_GROUP_META_FAIL,
    error,
  };
}

export function fetchGroupMeta() {
  return (dispatch) => {
    dispatch(getGroupMeta());
    return db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM group_meta',
        [],
        (_, result) => {
          console.log('Result', result);
          return dispatch(getGroupMetaSuccess(['fake', 'data']));
        },
        (_, error) => {
          console.log('Error', error);
          return dispatch(getGroupMetaFailure(error));
        }
      );
    });
  };
}
