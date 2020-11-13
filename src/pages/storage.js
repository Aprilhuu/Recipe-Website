let searchResults = {};

const Store = {
  saveResultList: function (state) {
    searchResults['results'] = state;
  },
  getResultList: function () {
    return searchResults['results'];
  },
  clearResultList: function () {
    searchResults = {};
  }
};

export default Store;
