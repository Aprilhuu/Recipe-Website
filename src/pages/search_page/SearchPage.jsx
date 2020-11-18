import React, {PureComponent} from 'react';
import SearchBar from "../../components/SearchBar/SearchBar";
import SearchResults from "../../components/SearchResults/SearchResults";
import {Carousel, Card, PageHeader, Button} from "antd";
import axios from 'axios';
import styles from './SearchPage.less';
import Store from "../storage";

import defaultSettings from '../../../config/defaultSettings';
const { api_endpoint } = defaultSettings

import { Link } from 'react-router-dom';
import FilterConfig from "../../components/FilterConfig/FilterConfig";
import {LeftCircleFilled, RightCircleFilled} from "@ant-design/icons";

/**
 * This class represents the entire search page. It includes a search bar.
 * Recipe recommendation component on first load and search result list after user
 * clicking search.
 */
class SearchPage extends PureComponent {
  state = {
    hasErrors: false, // Boolean to indicate if anything went wrong when working with backend
    isFetching: true, // Boolean to indicate if component is fetching data from backend
    recipeList: [], // List of recipes to display in search result
    sampleRecipes: [], // List of recipes to display for recommendation
    searchCriteria: [], // Search criteria entered in search bar
    noResult: false, // Boolean to indicate if any data return from searching
    pageNumber: 1 // Integer indicating which page the user is on before clicking into a recipe
  };

  constructor(props) {
    super(props);
    this.featuredRecipeRef = React.createRef();
  }

  componentDidMount() {
    // If loaded from page redirect
    if (this.props.location.state){
      this.setState({ recipeList: this.props.location.state.recipes,
        searchCriteria: this.props.location.state.searchCriteria, isFetching: false });
      if (!this.props.location.state.recipes.length){
        this.setState({noResult: true})
      }else{
        this.setState({noResult: false})
      }
    }
    // If loaded from back from a recipe detail page
    else{
      const state = Store.getResultList("search");
      this.setState(state)
    }

    // If not recipe to show on first load, fetch some random recipes to display as
    // recommendation
    if (!this.state.recipeList.length && !this.state.noResult){
      axios.get(api_endpoint +'/v1/recipes/query/random', {})
        .then(response =>{
          this.setState({ sampleRecipes: response.data.result })
        })
    }
    Store.clearResultList("list")
  }

  componentWillUnmount() {
    // Saving current search result page data (e.g. current page number,
    // current recipe list) before leaving the page
    Store.saveResultList(this.state, "search");
  }

  // Callback used to handle redirect after user click search button and
  // results haven been returned from backend
  handleRedirect = (searchResults, searchCriteria) => {
    this.setState({ recipeList: searchResults, searchCriteria: searchCriteria});
    if (!searchResults.length){
      this.setState({noResult: true})
    } else{
      this.setState({noResult: false})
    }
  }

  // Callback used to handle state update after user applies filter and
  // results haven been returned from backend
  handleFilter = (searchResults) => {
    this.setState({ recipeList: searchResults });
    if (!searchResults.length){
      this.setState({noResult: true})
    } else{
      this.setState({noResult: false})
    }
  }

  // Function used to get current search criteria from other components
  searchCriteria = () => {
    return this.state.searchCriteria;
  }

  // Callback function called when user click on Clear Filter button
  clearFilter = () => {
    let searchJSON;
    const currentCriteria = this.state.searchCriteria;
    if (typeof currentCriteria === "object"){
      searchJSON = {"ingredients": currentCriteria};
    }
    else if (typeof currentCriteria === "string"){
      searchJSON = {"title": currentCriteria};
    }
    // Query the database again with filters removed
    axios.post(api_endpoint +'/v1/recipes/query', searchJSON )
      .then(response =>{
        this.handleFilter(response['data']['result']);
      })
  }

  // actions to slide feature recipes left and right
  slideLeft = () => this.featuredRecipeRef.current.prev();
  slideRight = () => this.featuredRecipeRef.current.next();

  // Callback function used to update stored page number after going to a new page
  onPageChange = (pageNumber) => {
    this.setState({pageNumber: pageNumber})
  }

  render() {
    // Case #1: Just loaded, no search result, display recommendation
    if (!this.state.recipeList.length && !this.state.noResult){
      let recipeCardList = []
      const recipeArray = this.state.sampleRecipes
      // First, prepare cards to display based on sample recipes queried
      for (let i = 0; i < recipeArray.length; i++ ) {
        const item = recipeArray[i]
        let img_url = item.image
        if(img_url == null){
          img_url = "https://ww4.publix.com/-/media/aprons/default/no-image-recipe_600x440.jpg?as=1&w=417&h=306&hash=CA8F7C3BF0B0E87C217D95BF8798D74FA193959C"
        }

        let titleClassName;
        if (item.title.length > 35){
          titleClassName = styles.recipeTitleSmall
        } else{
          titleClassName = styles.recipeTitle
        }

        recipeCardList.push(
          <div key={i + '-featured-recipe'}>
            <Link to={"/recipe/" + item.id}>
              <Card hoverable cover={<img width={272} alt="recipe_image" src={img_url} />}>
                  <span className={titleClassName}>
                    {item.title}
                  </span>
                <br/>
                <span className={styles.descriptionText}>
                    {item.description}
                </span>
              </Card>
            </Link>
          </div>)
      }
      return(
        <Card style={{ minWidth: '420px', width: '50%', margin: 'auto' }}>
          <PageHeader
            title="Search Page"
            onBack={() => window.history.back()}
            subTitle={<span>Already have something in mind? Type in keywords and search!</span>}
          />
          <SearchBar style={{ marginTop: '20px'}} redirect={false} redirectCallback={this.handleRedirect} />
          <div style={{textAlign: '-webkit-center'}}>
            <h1> No idea yet? Check out these recipes! </h1>
            <Carousel autoplay style={{width: '50%'}} dots={false} ref={this.featuredRecipeRef}>
              {recipeCardList}
            </Carousel>
            <div style={{ margin: 'auto', display: 'table' }}>
              <LeftCircleFilled onClick={this.slideLeft} className={styles.arrows}/>
              <RightCircleFilled onClick={this.slideRight} className={styles.arrows}/>
            </div>
          </div>
        </Card>
      );
    }
    // Case #2: Have recipe search results (can be empty), display search result
    else{
      return(
        <Card>
          <PageHeader
            title="Search Page"
            onBack={() => window.history.back()}
            subTitle={<span>Already have something in mind? Type in keywords and search!</span>}
          />
          <SearchBar redirect={false} redirectCallback={this.handleRedirect} />
          <FilterConfig searchCriteria={this.searchCriteria} handleFilter={this.handleFilter}/>
          <Button type="primary" onClick={this.clearFilter} style={{marginBottom: '16px', marginLeft: '16px'}}>
            Clear Filter
          </Button>
          <SearchResults recipeList={this.state.recipeList} handleChange={this.onPageChange}
                         totalPage={this.state.recipeList.length} title={"Search Results"}
                         defaultCurrent={this.state.pageNumber}/>
        </Card>
      )
    }
  }
}

export default SearchPage;
