module.exports = {
  dispatches: {
    requests: {
      staffSearchForClientInfo: 'STAFF_SEARCH_FOR_CLIENT_INFO'
    },
    errors: {
      
    },
    ordersForStaff: {
      setActiveOrders: 'SET_ACTIVE_ORDERS',
      clearActiveOrders: 'CLEAR_ACTIVE_ORDERS'
    },
    loading: {
      setServerLoading: 'SET_SERVER_LOADING',
      clearServerLoading: 'CLEAR_SERVER_LOADING',
      setStaffGetClientIsLoading: 'SET_STAFF_GET_CLIENT_IS_LOADING',
      clearStaffGetClientIsLoading: 'CLEAR_STAFF_GET_CLIENT_IS_LOADING'
    }
  },
  state: {
    account: {
      
    },
    loading: {
      serverIsLoading: 'serverIsLoading',
      staffGetClientIsLoading: 'staffGetClientIsLoading'
    },
    ordersForStaff: {
      activeOrders: 'activeOrders'
    }
  }
};
