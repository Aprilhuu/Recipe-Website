import React, {PureComponent} from 'react';
import {Button, Input, Select, Tag} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import axios from "axios";
import defaultSettings from "../../../config/defaultSettings";
import {Redirect} from "react-router";

const { api_endpoint } = defaultSettings;
const { Option } = Select;

// Enum object defining supported search types
const searchType = {
  BYINGREDIENTS: 1,
  BYTITLE: 2
}

/**
 * This function is used to construct the dropdown in front of the search bar. User can select
 * search by ingredients or by keywords(title here)
 *
 * @param {function} handleSelectChange An callback function called when selected option changed
 *
 * @return React component of a dropdown to select search type
 */
const selectBefore = (handleSelectChange) => (
  <Select defaultValue="By Ingredients"
          className="select-before"
          onSelect={handleSelectChange}>
    <Option value={searchType.BYINGREDIENTS}>By Ingredients</Option>
    <Option value={searchType.BYTITLE}>By Keywords</Option>
  </Select>
);

/**
 * This function is used to construct the search button at the end of the search bar
 *
 * @param {function} handleClick An callback function called when search button is clicked
 *
 * @return React component of a search button
 */
const suffix = (handleClick) => (
  <Button type="primary" icon={<SearchOutlined /> } onClick={handleClick}>
    Search
  </Button>
);

/**
 * This function is used to construct ingredient tags below search bar based on user input
 *
 * @param {[string]} tagData An array of ingredient names user entered
 * @param {function} handleTagClose Callback function handling tag close
 *
 * @return React component of a list of ingredient tags
 */
function constructTag(tagData, handleTagClose){
  const tagList = []

  for(let i = 0; i < tagData.length; i++) {
    tagList.push(<Tag color="geekblue"
                      closable
                      key={"recipeTag" + i}
                      visible={true}
                      onClose={() => handleTagClose(tagData[i])}>
                  { tagData[i] }
                  </Tag>);
  }
  return tagList;
}


/**
 * This class represent the entire comment section in recipe detail page. It contains displaying
 * available comments and a form for submitting new comments.
 */
class SearchBar extends PureComponent {
  state = {
    value: "", // Value entered in input field
    searchType: searchType.BYINGREDIENTS, // Default searching type on load is by ingredients
    allIngredients: [], // A list of all ingredients names user entered so far
    redirect: false, // If need to redirect to search page when search is clicked
    queryResults:[], // List of recipes satisfying search criteria
    previousSearch:[] // Store search criteria entered by user before clicking search
  };

  constructor(props) {
    super(props);
    this.redirectPage = props.redirect
    if (props.redirectCallback){
      this.handleRedirect = props.redirectCallback
    }
  }

  // Callback used to handle pressing enter key in input bar
  handlePressEnter = () => {
    const newIngredient = this.state.value;
    if ((!newIngredient && this.state.allIngredients.length)
      || (newIngredient && this.state.searchType === searchType.BYTITLE)){
      this.handleClick();
    }
    if (newIngredient && this.state.searchType === searchType.BYINGREDIENTS){
      this.setState({
        value: "",
        allIngredients: this.state.allIngredients.concat(newIngredient)
      })
    }
  };

  // Callback used to handle entering input in the search bar
  handleChange = event => {
    this.setState({
      value: event.target.value
    });
  };

  // Callback used to handle selecting options in dropdown
  handleSelectChange = value => {
    this.setState({
      searchType: value,
      allIngredients: [],
      value: ""
    });
  };

  // Callback used to handle closing ingredient tags
  handleTagClose = removedTag => {
    const tags = this.state.allIngredients.filter(tag => tag !== removedTag);
    this.setState({ allIngredients: tags });
  };

  // Callback used to handle clicking search button
  handleClick = () => {
    if (this.state.searchType === searchType.BYINGREDIENTS){
      let searchArray = this.state.allIngredients
      if (this.state.value){
        searchArray = searchArray.concat(this.state.value)
      }
      axios.post(api_endpoint +'/v1/recipes/query', {"ingredients": searchArray})
        .then(response =>{
          this.setState({ redirect: true, queryResults: response['data']['result'],
            allIngredients: [], value: "", previousSearch: searchArray })
          if (!this.redirectPage){
            this.handleRedirect(response['data']['result'], searchArray)
          }
        })
    }
    else if (this.state.searchType === searchType.BYTITLE){
      const recipeTitle = this.state.value
      axios.post(api_endpoint +'/v1/recipes/query', {"title": recipeTitle})
        .then(response =>{
          this.setState({ redirect: true, queryResults: response['data']['result'],
          allIngredients: [], value: "", previousSearch: recipeTitle })
          if (!this.redirectPage){
            this.handleRedirect(response['data']['result'], recipeTitle)
          }
        })
    }
  }

  render() {
    let placeholderMsg;

    // Prepare placeholder message in input bar based on search type
    if (this.state.searchType === searchType.BYINGREDIENTS){
      placeholderMsg = "Please input one ingredient name at a time followed by Enter..."
    } else{
      placeholderMsg = "Please enter recipe title to search..."
    }

    // If redirect page, change route to /search-page and pass query data
    if (this.state.redirect && this.redirectPage){
      return <Redirect push to={{
        pathname: "/search-page",
        state: { recipes: this.state.queryResults, searchCriteria: this.state.previousSearch }
      }}/>
    }
    else{
      return (
        <div style={{ marginBottom: 16 }}>
          <Input addonBefore={selectBefore(this.handleSelectChange)}
                 suffix={suffix(this.handleClick)}
                 value={this.state.value}
                 placeholder={placeholderMsg}
                 onPressEnter={this.handlePressEnter}
                 onChange={this.handleChange}
          />
          <div style={{ marginTop: 16 }}>
            { constructTag(this.state.allIngredients, this.handleTagClose) }
          </div>
        </div>
      );
    }
  }
}

export default SearchBar;
