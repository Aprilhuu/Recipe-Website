let searchResults = {};

const Store = {
  saveResultList: function (state, page) {
    searchResults[page] = state;
  },
  getResultList: function (page) {
    return searchResults[page];
  },
  clearResultList: function (page) {
    if (page != null){
      delete searchResults[page];
    } else {
      searchResults = {};
    }
  }
};

export default Store;
