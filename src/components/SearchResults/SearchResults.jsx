import React from 'react';
import styles from './SearchResults.less';
import {Card, List, Rate, Row} from 'antd';
import {FieldTimeOutlined, RocketOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import convertTime from "../../helper_functions/convertTime";

/**
 * This function is used to construct a summary view of a recipe including its difficulty
 * and prep time needed. This will be display under description in recipe cards.
 *
 * @param {number} difficulty difficulty level of a recipe
 * @param {number} prepTime Preparation time of the recipe in minutes
 *
 * @return react components for recipe summary part in one div
 */
const recipeSummary = (difficulty, prepTime) => {
  // Determine difficulty based on prep time instead for better criteria
  if (prepTime <= 10){
    difficulty = 1;
  } else if (prepTime <= 30){
    difficulty = 2;
  } else if (prepTime <= 60){
    difficulty = 3;
  } else if (prepTime <= 120){
    difficulty = 4;
  } else{
    difficulty = 5;
  }

  return (
    <div>
      {/* Row 1: difficulty */}
      <Row span={6} className={styles.summaryRow}>
        <span>
          <Rate
            character={<RocketOutlined />}
            disabled
            defaultValue={difficulty}
            allowHalf={true}
          />
          <span className={styles.labelText}>{'Difficulty: ' + difficulty + '/5'}</span>
        </span>
      </Row>

      {/* Row 2: Prep time */}
      <Row span={12} className={styles.summaryRow}>
        <span className={styles.labelText}>
          <FieldTimeOutlined />
          <span className={styles.labelText}>{'Prep Time: ' + convertTime(prepTime) }</span>
        </span>
      </Row>
    </div>
  );
};


/**
 * This function is used to construct a summary view of a recipe including its difficulty
 * and prep time needed. This will be display under description in recipe cards.
 *
 * @param {function} handleChange Callback function used to page change
 * @param {[object]} recipeList A list of recipes data to render
 * @param {number} totalPage Total number of pages
 * @param {string} title Title to display as entire card name
 * @param {number} defaultCurrent Default page to go on load
 *
 * @return react components for recipe summary part in one div
 */
export default ({handleChange, recipeList, totalPage, title, defaultCurrent}) => {
  let header;
  if (title){
    header=<h1 style={{'margin':'20px'}}>{title}</h1>;
  } else{
    header=null;
  }
  return (
    <Card>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        size="large"
        header={header}
        pagination={{
          onChange: handleChange,
          pageSize: 9,
          total: totalPage,
          defaultCurrent: defaultCurrent,
          pageSizeOptions: [9],
        }}
        bordered={true}
        dataSource={recipeList}
        renderItem={item => {
          let img_url = item.image
          if(img_url == null){
            img_url = item.mediaURL.url
          }
          // Determine title size based on title length
          let titleClassName;
          if (item.title.length > 35){
            titleClassName = styles.recipeTitleSmall
          } else{
            titleClassName = styles.recipeTitle
          }

          return(
            <List.Item key={item.id+"_list_item"}>
              <Link to={"/recipe/" + item.id}>
                <Card hoverable cover={<img width={272} alt="recipe_image" src={img_url} />}>
                  <span className={titleClassName}>
                    {item.title}
                  </span>
                  <br/>
                  <span className={styles.descriptionText}>
                    {item.description}
                  </span>
                  {recipeSummary(item.difficulty, item.cooktime)}
                </Card>
              </Link>
            </List.Item>
          )
        }}
      />
    </Card>
  );
}






