import React, { PureComponent } from 'react';
import { Spin } from 'antd';

import RecipeLayout from "../layouts/RecipeLayout";
import axios from "axios";
import defaultSettings from '../../config/defaultSettings';
const {api_endpoint} = defaultSettings

class Recipes extends PureComponent {
    state = {
      hasErrors: false,
      isFetching: true,
      recipe_detail: {},
      fastReadingMode: false,
      rating: 0,
      ratingNum: 6,
      ratingSubmitted: false
    };

    constructor(props) {
      super(props);
      const { match } = this.props
      const { params } = match
      const { recipe_id } = params
      this.recipe_id = recipe_id
    }

    componentDidMount() {
      this.setState({isFetching: true});
      axios.get(api_endpoint+'/v1/recipes/'+ this.recipe_id, {})
        .then(response =>{
          /* TODO: Hacking with fake rating for now. Need a separate database to store all rating and comments info */
          this.setState({ recipe_detail: response['data']['result'],
            isFetching: false, rating: 3.5});
        })
    }

    handleSwitchChanged = () => {
      this.setState({ fastReadingMode: !this.state.fastReadingMode });
    };

    // This callback will update recipe rating displayed in the summary section
    // automatically after user submits a new rating
    handleRatingChanged = value => {
      this.setState({ rating: (value + this.state.rating * this.state.ratingNum)/ (this.state.ratingNum + 1),
        ratingSubmitted: true});
    };

  render() {
      // if your component is while fetching shows a loading to the user
      if(this.state.isFetching){
        return (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Spin size="large" />
          </div>
        );
      } else {
        return(
          <RecipeLayout recipeDetail={this.state.recipe_detail} fastReading={this.state.fastReadingMode}
                        onSwitchChanged={ this.handleSwitchChanged } rating={this.state.rating}
                        onRatingChanged={this.handleRatingChanged} ratingSubmitted={this.state.ratingSubmitted}/>
        )
      }
    }
  }

export default Recipes
