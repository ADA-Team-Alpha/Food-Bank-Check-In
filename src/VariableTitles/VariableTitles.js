module.exports = {
  dispatches: {
    requests: {
      staffSearchForClientInfo: 'STAFF_SEARCH_FOR_CLIENT_INFO'
    },
    errors: {
      
    },
    staff: {
      setActiveOrders: 'SET_ACTIVE_ORDERS',
      clearActiveOrders: 'CLEAR_ACTIVE_ORDERS',
      setSearchResultClientInfo: 'SET_SEARCH_RESULT_CLIENT_INFO',
      clearSearchResultClientInfo: 'CLEAR_SEARCH_RESULT_CLIENT_INFO',
      setSuccessfullySubmittedManualClientOrder: 'SET_SUCCESSFULLY_SUBMITTED_MANUAL_CLIENT_ORDER',
      clearSuccessfullySubmittedManualClientOrder: 'CLEAR_SUCCESSFULLY_SUBMITTED_MANUAL_CLIENT_ORDER'
    },
    loading: {
      setServerLoading: 'SET_SERVER_LOADING',
      clearServerLoading: 'CLEAR_SERVER_LOADING',
      setStaffGetClientInfoIsLoading: 'SET_STAFF_GET_CLIENT_IS_LOADING',
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
    staff: {
      activeOrders: 'activeOrders',
      searchResultClientInfo: 'searchResultClientInfo',
      submittedManualOrderSuccess: 'submittedManualOrderSuccess'
    }
  },
  localState: {
    locationID: 'locationID',
    householdID: 'householdID',
    dietaryRestrictions: 'dietaryRestrictions',
    walkingHome: 'walkingHome',
    pregnant: 'pregnant',
    childBirthday: 'childBirthday',
    snap: 'snap',
    other: 'other',
    pickupName: 'pickupName',
    waitTimeMinutes: 'waitTimeMinutes'
  },
  database: {
    account: {
      id: 'id',
      name: 'name',
      email: 'email',
      access_level: 'access_level',
      active: 'active',
      approved: 'approved'
    },
    order: {
      id: 'id',
      account_id: 'account_id',
      checkin_at: 'checkin_at',
      checkout_at: 'checkout_at',
      location_id: 'location_id',
      dietary_restrictions: 'dietary_restrictions',
      walking_home: 'walking_home',
      pregnant: 'pregnant',
      child_birthday: 'child_birthday',
      snap: 'snap',
      pickup_name: 'pickup_name',
      other: 'other',
      wait_time_minutes: 'wait_time_minutes'
    },
    profile: {
      account_id: 'account_id',
      household_id: 'household_id',
      latest_order: 'latest_order'
    }
  }
};
