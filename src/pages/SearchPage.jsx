import React, {PureComponent} from 'react';
import defaultSettings from '../../config/defaultSettings';
import SearchBar from "../components/SearchBar/SearchBar";
import RecipeList from "./RecipeList";
import RecipeListing from "../components/RecipeListing/RecipeListing";
import {Redirect} from "react-router";
const {api_endpoint} = defaultSettings

class SearchPage extends PureComponent {
  state = {
    hasErrors: false,
    isFetching: true,
    recipeList: []
  };

  constructor(props) {
    super(props);
    this.handleRedirect = this.handleRedirect.bind(this)
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.recipes){
      this.setState({ recipeList: this.props.location.state.recipes, isFetching: false });
    }
  }

  handleRedirect = (searchResults) => {
    this.setState({ recipeList: searchResults});
  }

  render() {
      return(
        <div>
          <SearchBar redirect={false} redirectCallback={this.handleRedirect} />
          <RecipeListing recipeList={this.state.recipeList} handleChange={()=>{}}
                         totalPage={this.state.recipeList.length} />
        </div>
      )
  }
}

export default SearchPage;
