import React, {PureComponent} from 'react';
import {Card, Button, Spin} from 'antd';

class RecipeList extends PureComponent {
  state = {
    hasErrors: false,
    isFetching: false,
    recipeList: [],
    fastReadingMode: false
  };

  componentDidMount() {
    // this.setState({isFetching: true});
    // axios.get(api_endpoint +'/v1/recipes/', {})
    //   .then(response =>{
    //     console.log(response);
    //     this.setState({ recipeList: response['data']['result'], isFetching: false });
    //   })
    console.log(this.props.location.state.recipes)
    this.setState({ recipeList: this.props.location.state.recipes });
  }

  render() {
    // if your component is while fetching shows a loading to the user
    if(this.state.isFetching){
      return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Spin size="large" />
        </div>
      );
    } else {
      const buttonList = [];
      for(let i = 0; i < this.state.recipeList.length; i++) {
        console.log(this.state.recipeList[i].title)
        const recipeDetail = this.state.recipeList[i];
        buttonList.push(<Button
          key = {recipeDetail['_id']}
          size = "large"
          block
          href={"/recipe/" + recipeDetail['_id']}>{recipeDetail.title}
        </Button>)
        buttonList.push(<br key={recipeDetail['_id'] + "br1"}/>)
        buttonList.push(<br key={recipeDetail['_id'] + "br2"}/>)
      }
      return(
        <Card>
          {buttonList}
        </Card>
      )
    }
  }
}

export default RecipeList;
