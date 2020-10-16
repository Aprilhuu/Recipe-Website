import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { recipes } from '../../recipes/recipes.js';

class Recipes extends PureComponent {
    constructor(props) {
      super(props);
      const { match } = this.props
      const { params } = match
      console.log(params)
      const { recipe_id } = params
      console.log(recipe_id)

      //can access all recipes this way
      console.log(recipes[recipe_id].title)
      this.recipe = recipes[recipe_id]
    }
    
    render() {
      return(
        <Card>{this.recipe.title}</Card>
      )
    }
  }
  
export default Recipes