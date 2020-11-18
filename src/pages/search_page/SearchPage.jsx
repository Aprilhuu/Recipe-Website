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


class SearchPage extends PureComponent {
  state = {
    hasErrors: false,
    isFetching: true,
    recipeList: [],
    sampleRecipes: [],
    searchCriteria: [],
    noResult: false
  };

  constructor(props) {
    super(props);
    this.featuredRecipeRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.location.state){
      this.setState({ recipeList: this.props.location.state.recipes,
        searchCriteria: this.props.location.state.searchCriteria, isFetching: false });
      if (!this.props.location.state.recipes.length){
        this.setState({noResult: true})
      }else{
        this.setState({noResult: false})
      }
    } else{
      const state = Store.getResultList();
      this.setState(state)
    }
    if (!this.state.recipeList.length){
      axios.get(api_endpoint +'/v1/recipes/query/random', {})
        .then(response =>{
          this.setState({ sampleRecipes: response.data.result })
        })
    }
  }

  componentWillUnmount() {
    Store.saveResultList(this.state);
  }

  handleRedirect = (searchResults, searchCriteria) => {
    this.setState({ recipeList: searchResults, searchCriteria: searchCriteria});
    if (!searchResults.length){
      this.setState({noResult: true})
    } else{
      this.setState({noResult: false})
    }
  }

  handleFilter = (searchResults) => {
    this.setState({ recipeList: searchResults });
    if (!searchResults.length){
      this.setState({noResult: true})
    } else{
      this.setState({noResult: false})
    }
  }

  searchCriteria = () => {
    return this.state.searchCriteria;
  }

  clearFilter = () => {
    let searchJSON;
    const currentCriteria = this.state.searchCriteria;
    if (typeof currentCriteria === "object"){
      searchJSON = {"ingredients": currentCriteria};
    }
    else if (typeof currentCriteria === "string"){
      searchJSON = {"title": currentCriteria};
    }

    axios.post(api_endpoint +'/v1/recipes/query', searchJSON )
      .then(response =>{
        this.handleFilter(response['data']['result']);
      })

  }

  // actions to slide feature recipes left and right
  slideLeft = () => this.featuredRecipeRef.current.prev();

  slideRight = () => this.featuredRecipeRef.current.next();

  render() {
    if (!this.state.recipeList.length && !this.state.noResult){
      let recipeCardList = []
      const recipeArray = this.state.sampleRecipes
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
          <SearchBar redirect={false} redirectCallback={this.handleRedirect} />
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
    else{
      console.log(this.state.searchCriteria)
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
          <SearchResults recipeList={this.state.recipeList} handleChange={()=>{}}
                         totalPage={this.state.recipeList.length} title={"Search Results"} />
        </Card>
      )
    }
  }
}

export default SearchPage;
