module.exports = {
  user: {
    getUserInfoQuery: `SELECT account.id, account."name", account.email,
                      account.access_level, account.active, account.approved,
                      profile.household_id, profile.latest_order FROM account
                      LEFT JOIN profile ON account.id = profile.account_id
                      WHERE account.id = $1;`,
    getOrdersFromToday: `SELECT "order".* FROM "order"
                        WHERE cast(checkin_at as date) = CURRENT_DATE
                        AND "order".account_id = $1;`
  }
};
