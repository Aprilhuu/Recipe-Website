/* eslint-disable react/no-unescaped-entities */
import React, {PureComponent } from 'react';
import { Card, Image, Carousel, Popover } from 'antd';
import { Link } from 'umi';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import styles from './Welcome.less';
import searchIllust from '../assets/images/search_illust.jpg'
import mealPlanIllust from '../assets/images/meal_plan_illust.jpg'
import pantryIllust from '../assets/images/pantry_illust.jpg'
import Store from "./storage";
import defaultSettings from '../../config/defaultSettings';

const { api_endpoint } = defaultSettings
const { Meta } = Card;

class WelcomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.carouselRef = React.createRef();
    this.featuredRecipeRef = React.createRef();
    this.descriptionCharLength = 50;
    this.featuredRecipesDisplayed = 3;
    this.state = {
      recipeCardList: [],
      popoverPlacement: 'right',
    }
    this.mealPlannerDescription = <div style={{ maxWidth: '200px' }}>
      <div>
        <b>1. Adding items:</b> click 'Add item' on the top right of the meal planner. Search for your meal and save.
      </div>
      <div>
        <b>2. Removing items:</b> click the 'x' on the top right of each meal card to remove it.
      </div>
      <div>
        <b>3. Plan your week:</b> each week, your meal plan will refresh, so don't forget to fill it out for every week! 
      </div>
    </div>

    this.shoppingListDescription = <div style={{ maxWidth: '200px' }}>
      <div>
        <b>1. Buying items:</b> whenever you buy an ingredient, click the checkbox to move your item into your Ticked Items list.
      </div>
      <div>
        <b>2. Misclick:</b> if you misclicked and your item is moved into your Ticked Items list, click the + button to add it back.
      </div>
      <div>
        <b>3. Integration with meal planner:</b> this shopping list is integrated with meal planner, which means that every time you update your meal plan, the ingredients required will automatically be populated in your shopping list.
      </div>
      <div>
        <b>4. Updating the meal planner:</b> watch out! Every time you update your meal planner, your shopping list will reset.
      </div>
    </div>

    this.searchDescription = <div style={{ maxWidth: '200px' }}>
      todo
    </div>
  }

  componentDidMount() {
    // add event listener for resize handler
    window.addEventListener("resize", this.handleResize);

    // query random recipe for featured recipes
    axios.get(`${api_endpoint}/v1/recipes/query/random`, {})
    .then(response =>{
      const recipeCardList = []
      const recipeArray = response.data.result;

      // adding featured recipes cards
      for (let i = 0; i < recipeArray.length; i += 1) {
        recipeCardList.push(
          <div key={`${i}-featured-recipe`}>
            <Link to={`/recipe/${recipeArray[i].id}`}>
              <Card
                cover={
                  <div className={styles.imageWrapper} style={{ width:'100%', height: '30vh'}}>
                    <img
                    alt='some featured recipe'
                    src={recipeArray[i].image}
                    className={styles.featuredImage}
                    />
                  </div>    
                }
              >
                <Meta
                  title={recipeArray[i].title}
                  description={recipeArray[i].description}
                />
              </Card>
            </Link>
          </div>)
      }
      this.setState({ recipeCardList })

      // clear search results
      Store.clearResultList();
    })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  // when the user hovers over any of the three help blocks
  onMouseEnterSearch = () => this.carouselRef.current.goTo(0, true);

  onMouseEnterMealPlanner = () => this.carouselRef.current.goTo(1, true);

  onMouseEnterShoppingList = () => this.carouselRef.current.goTo(2, true);

  // actions to slide feature recipes left and right
  slideLeft = () => this.featuredRecipeRef.current.prev();

  slideRight = () => this.featuredRecipeRef.current.next();

  // handles the placement of popup with respect to window size
  handleResize() {
    let { popoverPlacement } = this.state;

    if (window.innerWidth > 1000) {
      popoverPlacement = 'right';
    } else {
      popoverPlacement = 'bottomLeft';
    }

    this.setState({ popoverPlacement });
   };

  render() {
    return(
      <Card className = {styles.blackBackground} >
        <Card bordered={false} className={[styles.blackTitleBox, styles.whiteText]}>
          <div className = {styles.titleText}>Chef Co-Pilot</div>
          <div className = {styles.subText}>Chef CoPilot is a recipe hub that you can use to plan recipes for your future meals. Let's cook together!</div>
        </Card>
        <Card bordered={false} className={styles.whiteSubBox}>
          <div className={styles.helpBoxWrapper} style={{ width: '50%' }}>
            <div className={styles.whiteSubBoxTitle}>Hover over each box for help and tips regarding our functions.</div>
            <div className={styles.helpFlex}>
              <Carousel className={styles.helpBox} style={{ minWidth: '300px', width:"20vw"}} ref={this.carouselRef}>
                <div> <Image
                    src={searchIllust}
                  />
                </div>
                <div> <Image
                    src={mealPlanIllust}
                  />
                </div>
                <div> <Image
                    src={pantryIllust}
                  />
                </div>
              </Carousel>
              <div className={styles.helpBox}>
                <Popover placement={this.state.popoverPlacement} key='search-popover' content={this.searchDescription} title="How to Use Search">    
                  <Card style={{margin:"10px"}} onMouseEnter={this.onMouseEnterSearch}>
                    <Meta 
                      title="Search"
                      description="Search by ingredients or recipe name, we have you covered."
                    />
                  </Card>
                </Popover>
                <Popover placement={this.state.popoverPlacement} key='meal-planner-popover' content={this.mealPlannerDescription} title="How to Use Meal Planner">
                  <Card style={{margin:"10px"}} onMouseEnter={this.onMouseEnterMealPlanner}>
                    <Meta 
                      title="Meal Planner"
                      description="Plan your meals week by week. We'll sort out your shopping list."
                    />
                  </Card>
                </Popover>
                <Popover  placement={this.state.popoverPlacement} key='shopping-list' content={this.shoppingListDescription} title="How to Use Shopping List">
                  <Card style={{margin:"10px"}} onMouseEnter={this.onMouseEnterShoppingList}>
                    <Meta 
                      title="Shopping List"
                      description="Keeps track of ingredients you need for your meal plan."
                    />
                  </Card>
                </Popover>
              </div>
            </div>
          </div>
        </Card>
        <Card bordered={false} className={[styles.blackSubBox, styles.whiteText]}>
          <div className={styles.helpBoxWrapper} style={{ maxWidth: '300px', width: 'calc(1500px -  50vw)', height: '50vh'}}>
            <div className={styles.blackSubBoxTitle}>Check out our recipes!</div>
            <div className={styles.blackSubBoxSubtitle}>No account? No Problem. View some of our featured recipes.</div>
            <Carousel
              style={{ paddingTop: '30px' }}
              autoplay
              dots={false}
              ref={this.featuredRecipeRef}
            >
              {this.state.recipeCardList}
            </Carousel>
            <div style={{ paddingTop: '20px', margin: 'auto', display: 'table' }}>
              <LeftCircleFilled onClick={this.slideLeft} className={styles.arrows}/>
              <RightCircleFilled onClick={this.slideRight} className={styles.arrows}/>
            </div>
          </div>

        </Card>
      </Card>
    )
  }
}

export default WelcomePage
