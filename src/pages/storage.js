/**
 * This file is stating the logic to store recipe viewing status after
 * user clicked into a recipe detail page. We do not want user to start
 * from page 1 again, instead, they should be able to resume on where they
 * left.
 */
let searchResults = {};

const Store = {
  // Save current states based on page name
  saveResultList: function (state, page) {
    searchResults[page] = state;
  },
  // Find saved states based on page name
  getResultList: function (page) {
    return searchResults[page];
  },
  // Clear saved states based on page name
  clearResultList: function (page) {
    if (page != null){
      delete searchResults[page];
    } else {
      searchResults = {};
    }
  }
};

export default Store;
