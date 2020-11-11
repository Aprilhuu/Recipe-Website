import React, {PureComponent} from 'react';
import SearchBar from "../components/SearchBar/SearchBar";
import RecipeListing from "../components/RecipeListing/RecipeListing";

class SearchPage extends PureComponent {
  state = {
    hasErrors: false,
    isFetching: true,
    recipeList: []
  };

  constructor(props) {
    super(props);
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
    if (!this.state.recipeList.length){
      return(
        <div>
          <SearchBar redirect={false} redirectCallback={this.handleRedirect} />
          <RecipeListing recipeList={this.state.recipeList} handleChange={()=>{}}
                         totalPage={this.state.recipeList.length} />
        </div>
      );
    }
    else{
      return(
        <div>
          <SearchBar redirect={false} redirectCallback={this.handleRedirect} />
          <RecipeListing recipeList={this.state.recipeList} handleChange={()=>{}}
                         totalPage={this.state.recipeList.length} />
        </div>
      )
    }
  }
}

export default SearchPage;
