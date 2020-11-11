import React, {PureComponent} from 'react';
import {Card, Carousel, Image} from 'antd';
import styles from './Welcome.less';
import searchIllust from '../assets/images/search_illust.jpg'
import mealPlanIllust from '../assets/images/meal_plan_illust.jpg'
import pantryIllust from '../assets/images/pantry_illust.jpg'
import {recipes} from '../../recipes/recipes.js';
import Store from "./storage";

const { Meta } = Card;

class WelcomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
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
      // console.log(key)
      // console.log(value.title)
      // if (value.mediaURL.type == 'image') {
      //   console.log(value.mediaURL.url)
      // }
      // console.log(value.difficulty)
      // console.log((value.instructions[0].description).slice(0, this.descriptionCharLength)  + "...")


      recipeCardList.push(
      <div style={{ flex: "33.33%", padding: "5px"}} key={value.title}>
        <Card
            style={{ width: "300px" }}
            cover={
                <img
                src={value.mediaURL.url}
                />
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
      Store.clearResultList();
    }
  }

  createRecipeCard() {
    for (const [key, value] of Object.entries(recipes)) {
      // console.log(key)
      // console.log(value)
    }
  }

  onMouseEnterSearch = () => this.carouselRef.current.goTo(0, false);

  onMouseEnterMealPlanner = () => this.carouselRef.current.goTo(1, false);

  onMouseEnterVirtualPantry = () => this.carouselRef.current.goTo(2, false);

  render() {
    return(
      <Card className = {styles.blackBackground} >
        <Card bordered={false} className={[styles.blackTitleBox, styles.whiteText]}>
          <div className = {styles.titleText}>Chef Co-Pilot</div>
          <div className = {styles.subText}>Chef CoPilot is a recipe hub that you can use to plan recipes for your future meals. Let's cook together!</div>
        </Card>
        <Card bordered={false} className={styles.whiteSubBox}>
          <div className={styles.helpBoxWrapper}>
            <div className={styles.whiteSubBoxTitle}>Learn about our functions.</div>
            <div style={{ display: "flex", marginTop:"20px" }}>
              <div className={styles.helpBox}>
                <Carousel style={{width:"20vw"}} ref={this.carouselRef}>
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
              </div>
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
          <div className={styles.helpBoxWrapper}>
            <div className={styles.blackSubBoxTitle}>Check out our recipes!</div>
            <div className={styles.blackSubBoxSubtitle}>No account? No Problem. View some of our featured recipes.</div>
            <div style={{ display: "flex", marginTop:"20px" }}>
              {/* <div style={{ flex: "33.33%", padding: "5px"}}>
                <Card
                  style={{ width: 300 }}
                  cover={
                    <img
                      src={searchIllust}
                    />
                  }
                >
                  <Meta
                    title="Card title"
                    description="This is the description"
                  />
                </Card>
              </div> */}
              {this.state.recipeCardList}
            </div>


          </div>

        </Card>
      </Card>
    )
  }
}

export default WelcomePage
