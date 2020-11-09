import React, {PureComponent} from 'react';
import {Card, Button, Spin, List, Typography, Divider, BackTop } from 'antd';
import axios from "axios";
import { Link } from 'umi';
import defaultSettings from '../../config/defaultSettings';
const {api_endpoint} = defaultSettings

class RecipeList extends PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this)

    this.state = {
      hasErrors: false,
      isFetching: true,
      recipeList: [],
      fastReadingMode: false
    };
  }

  componentDidMount() {
    this.setState({isFetching: true});
    axios.get(api_endpoint +'/v1/recipes/', {})
      .then(response =>{
        // console.log(response);
        this.setState({ recipeList: response['data']['result'], isFetching: false });
      })

    axios.get(api_endpoint +'/v1/recipes/count', {})
      .then(response =>{
        this.setState({ totalPage: response['data']['result'], isFetching: false });
      })
  }

  onChange(page){
    console.log(page);

    axios.get(api_endpoint +'/v1/recipes/?page='+page+'&page_size=10', {})
      .then(response =>{
        // console.log(response);
        this.setState({ recipeList: response['data']['result'], isFetching: false });
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
        <Card>
          <BackTop>
            <div style={{
              height: 40,
              width: 40,
              lineHeight: '40px',
              borderRadius: 4,
              backgroundColor: '#1088e9',
              color: '#fff',
              textAlign: 'center',
              fontSize: 14,
            }}>UP</div>
          </BackTop>
          <List
            itemLayout="vertical"
            size="large"
            header={<h1 style={{'margin':'20px'}}>Recipes</h1>}
            pagination={{
              onChange: this.onChange,
              pageSize: 10,
              total: totalPage,
              pageSizeOptions: [10],
            }}
            bordered={true}
            dataSource={this.state.recipeList}
            renderItem={item => {
              var img_url = item.image
              if(img_url == null){
                img_url = "https://ww4.publix.com/-/media/aprons/default/no-image-recipe_600x440.jpg?as=1&w=417&h=306&hash=CA8F7C3BF0B0E87C217D95BF8798D74FA193959C"
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
