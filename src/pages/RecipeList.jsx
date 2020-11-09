import React, {PureComponent} from 'react';
import {Card, Button, Spin, List, Typography, Divider} from 'antd';
import axios from "axios";
import { Link } from 'umi';
import defaultSettings from '../../config/defaultSettings';
const {api_endpoint} = defaultSettings

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

class RecipeList extends PureComponent {
  state = {
    hasErrors: false,
    isFetching: true,
    recipeList: [],
    fastReadingMode: false
  };

  componentDidMount() {
    this.setState({isFetching: true});
    axios.get(api_endpoint +'/v1/recipes/', {})
      .then(response =>{
        // console.log(response);
        this.setState({ recipeList: response['data']['result'], isFetching: false });
      })
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
      // var buttonList = []
      // for(let i = 0; i < this.state.recipeList.length-19; i++) {
      //   console.log(this.state.recipeList[i].title)
      //   const recipeDetail = this.state.recipeList[i];
      //   buttonList.push(<Button
      //     key = {recipeDetail.id}
      //     size = "large"
      //     block
      //     href={"/recipe/" + recipeDetail.id}>{recipeDetail.title}
      //   </Button>)
      //   buttonList.push(<br key={recipeDetail.id + "br1"}/>)
      //   buttonList.push(<br key={recipeDetail.id + "br2"}/>)
      // }

      // console.log(this.state.recipeList)

      return(
        <Card>
          <List
            itemLayout="vertical"
            size="large"
            header={<h1 style={{'margin':'20px'}}>Recipes</h1>}
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 10,
            }}
            bordered={true}
            dataSource={this.state.recipeList}
            renderItem={item => {
              var img_url = item.image
              if(img_url == null){
                img_url = "https://ww4.publix.com/-/media/aprons/default/no-image-recip…=1&w=417&h=306&hash=CA8F7C3BF0B0E87C217D95BF8798D74FA193959C"
              }

              return(
                <List.Item
                  key={item.id+"_list_item"}
                  extra={
                    <img
                      width={272}
                      alt="recipe_image"
                      src={img_url}
                    />
                  }
                >
                  <List.Item.Meta
                    title={<Link to={"/recipe/" + item.id}>{item.title}</Link>}
                  />
                  {item.description}
                </List.Item>
              )
            }}
          />
        </Card>
      )
    }
  }
}

export default RecipeList
