import React, {PureComponent} from 'react';
import {Spin} from 'antd';
import axios from "axios";
import defaultSettings from '../../config/defaultSettings';
import RecipeListing from "../components/RecipeListing/RecipeListing";
import SearchResults from "../components/SearchResults/SearchResults";
import Store from "./storage";

const {api_endpoint} = defaultSettings

class RecipeList extends PureComponent {
  state = {
    hasErrors: false,
    isFetching: true,
    recipeList: [],
    fastReadingMode: false
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this)

  }

  componentDidMount() {
    this.setState({isFetching: true});
    Store.clearResultList()
    axios.get(api_endpoint +'/v1/recipes/', {})
      .then(response =>{
        // console.log(response);
        this.setState({ recipeList: response['data']['result'], isFetching: false });
    }).catch(function (error) {
      console.log(error);
    });

    axios.get(api_endpoint +'v1/recipes/count', {})
      .then(response =>{
        this.setState({ totalPage: response['data']['result'], isFetching: false });
    }).catch(function (error) {
      console.log(error);
    });
  }

  onChange(page){
    console.log(page);

    axios.get(api_endpoint +'/v1/recipes/?page='+(page-1)+'&page_size=9', {})
      .then(response =>{
        // console.log(response);
        this.setState({ recipeList: response['data']['result'], isFetching: false });
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
      })
  }

  render() {
    const { totalPage } = this.state

    // if your component is while fetching shows a loading to the user
    if(this.state.isFetching){
      return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Spin size="large" />
        </div>
      );
    } else {
      return(
        <SearchResults handleChange={this.onChange} recipeList={this.state.recipeList} totalPage={totalPage} />
      )
    }
  }
}

export default RecipeList;
