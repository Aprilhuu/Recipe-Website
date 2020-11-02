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
      fastReadingMode: false
    };

    constructor(props) {
      super(props);
      const { match } = this.props
      const { params } = match
      console.log(params)
      const { recipe_id } = params
      this.recipe_id = recipe_id
      console.log(recipe_id)
    }

    componentDidMount() {
      this.setState({isFetching: true});
      axios.get(api_endpoint+'/v1/recipes/'+ this.recipe_id, {})
        .then(response =>{
          this.setState({ recipe_detail: response['data']['result'], isFetching: false });
        })
    }

    handleSwitchChanged = () => {
      this.setState({ fastReadingMode: !this.state.fastReadingMode });
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
                        onSwitchChanged={ this.handleSwitchChanged }/>
        )
      }
    }
  }

export default Recipes
