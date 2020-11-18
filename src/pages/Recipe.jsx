import React, {PureComponent} from 'react';
import {Spin} from 'antd';

import RecipeLayout from "../layouts/RecipeLayout";
import axios from "axios";
import defaultSettings from '../../config/defaultSettings';

const {api_endpoint} = defaultSettings

/**
 * This class represents the entire recipe page. It uses the RecipeLayout from layouts folder
 * to render a recipe detail page. This class is only used as a container to store appropriate
 * states and talking with backend.
 */
class Recipes extends PureComponent {
    state = {
      hasErrors: false, // Boolean to indicate if an error occurred when working with backend
      isFetching: true, // Boolean to indicate if the component is fetching recipe data from backend
      isFetchingComments: true, // Boolean to indicate if the component is fetching comment data from backend
      recipe_detail: {}, // Object used to store recipe detail info fetched from database
      recipe_comments: [], // A list of all comments available for this recipe
      fastReadingMode: false, // Boolean to indicate if fast-reading mode is on
      rating: 0, // Number to keep track of ratings after user submit a new rating data
      ratingCount: 0, // Number to count total ratings received so far so that average can be calculated
      ratingSubmitted: false // Boolean to indicate if user has submitted a rating
    };

    constructor(props) {
      super(props);
      const { match } = this.props
      const { params } = match
      const { recipe_id } = params
      this.recipe_id = recipe_id
    }

    componentDidMount() {
      // Step #1: Setting states to fetching
      this.setState({isFetching: true, isFetchingComments: true});

      // Step #2: Fetching recipe detail data from backend
      axios.get(api_endpoint +'/v1/reviews/'+ this.recipe_id, {})
        .then(response =>{
          if (response['data']){
            this.setState({ recipe_comments: response['data']['result']['comments'],
              rating: response['data']['result']['rating'],
              ratingCount: response['data']['result']['rating_count'], isFetchingComments: false
            });
          } else {
            this.setState({ isFetchingComments: false });
          }
        }).catch(error => {
          // This indicates that no reviews or ratings have been submitted for this recipe.
          // Keep initialized default values
        console.log(error)
        this.setState({ isFetchingComments: false });
      })

      axios.get(api_endpoint +'/v1/recipes/'+ this.recipe_id, {})
        .then(response =>{
          this.setState({ recipe_detail: response['data']['result'], isFetching: false });
        })
    }

    // Callback used to turn on/off fast-reading mode
    handleSwitchChanged = () => {
      this.setState({ fastReadingMode: !this.state.fastReadingMode });
    };

    // This callback will update recipe rating displayed in the summary section
    // automatically after user submits a new rating
    handleRatingChanged = value => {
      const newRating = (value + this.state.rating * this.state.ratingCount)/ (this.state.ratingCount + 1)
      axios.post(api_endpoint +'/v1/reviews/'+ this.recipe_id, {"rating": newRating})
        .then(response =>{
          console.log(response)
        })
      this.setState({ rating: newRating, ratingSubmitted: true});
    };

  render() {
      // if your component is fetching data from backend shows a loading to the user
      if(this.state.isFetching || this.state.isFetchingComments ){
        return (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Spin size="large" />
          </div>
        );
      } else {
        return(
          <RecipeLayout recipeDetail={this.state.recipe_detail} fastReading={this.state.fastReadingMode}
                        onSwitchChanged={ this.handleSwitchChanged } rating={this.state.rating}
                        onRatingChanged={this.handleRatingChanged} ratingSubmitted={this.state.ratingSubmitted}
                        commentData={this.state.recipe_comments}/>
        )
      }
    }
  }

export default Recipes
