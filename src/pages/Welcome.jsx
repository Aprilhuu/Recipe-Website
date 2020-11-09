import React, {PureComponent } from 'react';
import { Card, Image, Carousel } from 'antd';
import styles from './Welcome.less';
import searchIllust from '../assets/images/search_illust.jpg'
import mealPlanIllust from '../assets/images/meal_plan_illust.jpg'
import pantryIllust from '../assets/images/pantry_illust.jpg'
import { recipes } from '../../recipes/recipes.js';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';

const { Meta } = Card;

class WelcomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
    this.featuredRecipeRef = React.createRef();
    this.descriptionCharLength = 50;
    this.featuredRecipesDisplayed = 3;
    this.state = {
      recipeCardList: []
    }
  }

  componentDidMount() {
    let recipeCardList = []
    let i = 0;
    for (const [key, value] of Object.entries(recipes)) {
      if (i >= this.featuredRecipesDisplayed) break;

      // don't use the featured recipe if it does not have an image
      if (value.mediaURL.type == 'image') {
        recipeCardList.push(
          <div key={i}>
            <Card
              cover={
                <div className={styles.imageWrapper} style={{ width:'100%', height: '30vh'}}>
                  <img
                  src={value.mediaURL.url}
                  className={styles.featuredImage}
                  />
                </div>    
              }
            >
              <Meta
                title={value.title}
                description={(value.instructions[0].description).slice(0, this.descriptionCharLength) + "..."}
              />
            </Card>
          </div>)
    
          this.setState({ recipeCardList: recipeCardList})
          i++;
      }
    }
  }
  
  onMouseEnterSearch = () => this.carouselRef.current.goTo(0, false);

  onMouseEnterMealPlanner = () => this.carouselRef.current.goTo(1, false);

  onMouseEnterVirtualPantry = () => this.carouselRef.current.goTo(2, false);

  slideLeft = () => this.featuredRecipeRef.current.prev();

  slideRight = () => this.featuredRecipeRef.current.next();

  render() {
    return(
      <Card className = {styles.blackBackground} >
        <Card bordered={false} className={[styles.blackTitleBox, styles.whiteText]}>
          <div className = {styles.titleText}>Chef Co-Pilot</div>
          <div className = {styles.subText}>Chef CoPilot is a recipe hub that you can use to plan recipes for your future meals. Let's cook together!</div>
        </Card>
        <Card bordered={false} className={styles.whiteSubBox}>
          <div className={styles.helpBoxWrapper} style={{ width: '50%' }}>
            <div className={styles.whiteSubBoxTitle}>Learn about our functions.</div>
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
                <Card style={{margin:"10px"}} onMouseEnter={this.onMouseEnterSearch}>
                  <Meta 
                    title="Search"
                    description="Search by ingredients or recipe name, we have you covered."
                  />
                </Card>
                <Card style={{margin:"10px"}} onMouseEnter={this.onMouseEnterMealPlanner}>
                  <Meta 
                    title="Meal Planner"
                    description="Plan your meals week by week. We'll sort out your shopping list."
                  />
                </Card>
                <Card style={{margin:"10px"}} onMouseEnter={this.onMouseEnterVirtualPantry}>
                  <Meta 
                    title="Virtual Pantry"
                    description="Let us know your inventory and we'll let you know what to cook."
                  />
                </Card>
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