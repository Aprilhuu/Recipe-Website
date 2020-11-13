import React from 'react';
import styles from './RecipeListing.less';
import {Card, List} from "antd";
import { Link } from "umi";

/**
 * This function is used to construct a nutrition label widget. Code is refactored from
 * reference design here: https://codepen.io/chriscoyier/pen/egHEK
 */
export default ({handleChange, recipeList, totalPage}) => (
  <Card>
    <List
      itemLayout="vertical"
      size="large"
      header={<h1 style={{'margin':'20px'}}>Recipes</h1>}
      pagination={{
        onChange: handleChange,
        pageSize: 10,
        total: totalPage,
        pageSizeOptions: [10],
      }}
      bordered={true}
      dataSource={recipeList}
      renderItem={item => {
        let img_url = item.image
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
);

