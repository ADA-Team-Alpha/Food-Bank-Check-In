module.exports = {
  user: {
    getUserInfoQuery: `SELECT account.id, account."name", account.email, account.access_level, account.active,
                      profile.household_id, profile.latest_order FROM account
                      LEFT JOIN profile ON account.id = profile.account_id
                      WHERE account.id = $1;`
  }
};
