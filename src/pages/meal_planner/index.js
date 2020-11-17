import React, {PureComponent } from 'react';
import axios from 'axios';
import { Table, PageHeader, Card, Typography, Modal, Button, Alert } from 'antd';
import { CheckCircleTwoTone, CloseSquareFilled } from '@ant-design/icons';
import { Link } from 'umi';
import MealConfig from './mealConfig.jsx'
import NutritionTarget from './nutritionTarget.js'
import Store from "../storage";
import defaultSettings from '../../../config/defaultSettings';

const { Title } = Typography;
const { Meta } = Card;
const { api_endpoint } = defaultSettings;

/**
 * This function is used to get the Monday of the current week. The following three functions were taken from this link:
 * https://stackoverflow.com/questions/5210376/how-to-get-first-and-last-day-of-the-week-in-javascript
 *
 * @param {Date} d The current date.
 *
 * @return The date for the current week.
 * 
 */
const getMonday = (d) => {
  const new_d = new Date(d);
  const day = new_d.getDay();
  const diff = new_d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
  return new Date(new_d.setDate(diff));
}

/**
 * This function is used to get a usable date string (in text) with the Date variable.
 *
 * @param {Date} date Any date.
 *
 * @return A string in usable form. For example: Monday, Nov 09 2020.
 * 
 */
const getDateString = (date) => {
  const dateData = date.toString().split(' ');
  const dateString = `${dateData[0]}day, ${dateData[1]} ${dateData[2]} ${dateData[3]}`;
  return dateString;
}

/**
 * This function uses the above functions to return a date range starting from the Monday of the current week
 * to the Sunday of the current week.
 *
 * @return A date range given the current date from your computer. For example, it if is Friday, Nov 13 2020 today,
 * then it will return Monday, Nov 09 2020 - Sunday, Nov 15 2020.
 * 
 */
const getWeekString = () => {
  const daysOfPlan = 7
  const curDate = new Date;

  const startDate = getMonday(curDate);
  const endDate = new Date(startDate.getTime() + (daysOfPlan - 1) * 86400000 );

  const startDateString = getDateString(startDate);
  const endDateString = getDateString(endDate);

  const weekString = `${startDateString} - ${endDateString}`;

  return weekString;
}

// https://quaranteam-group3.atlassian.net/browse/CCP-3
class MealPlanner extends PureComponent {
  constructor(props) {

    super(props);

    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.add_new_plan = this.add_new_plan.bind(this);
    this.save_my_plan = this.save_my_plan.bind(this);
    this.openRemoveModal = this.openRemoveModal.bind(this);
    this.removeEntry = this.removeEntry.bind(this);
    this.render_column_func = this.render_column_func.bind(this);
    this.save_my_plan = this.save_my_plan.bind(this);
    this.update_nutrition = this.update_nutrition.bind(this);

    this.state = {
      'meal_plan': [],
      'columns': [
        {
          title: 'Meal Time',
          dataIndex: 'meals',
          key: 'meals',
          width: '8%'
        },
        {
          title: 'Monday',
          dataIndex: 'monday',
          key: 'monday',
          render: this.render_column_func
        },
        {
          title: 'Tuesday',
          dataIndex: 'tuesday',
          key: 'tuesday',
          render: this.render_column_func
        },
        {
          title: 'Wednesday',
          dataIndex: 'wednesday',
          key: 'wednesday',
          render: this.render_column_func
        },
        {
          title: 'Thursday',
          dataIndex: 'thursday',
          key: 'thursday',
          render: this.render_column_func
        },
        {
          title: 'Friday',
          dataIndex: 'friday',
          key: 'friday',
          render: this.render_column_func
        },
        {
          title: 'Saturday',
          dataIndex: 'saturday',
          key: 'saturday',
          render: this.render_column_func
        },
        {
          title: 'Sunday',
          dataIndex: 'sunday',
          key: 'sunday',
          render: this.render_column_func
        }
      ],
      week: [],
      nutrition_target:{'calories':0, 'carbon':0, 'fiber':0},
      modal_confirm_visible: false,
      removal_meal_index: [],
      removal_day: []
    };
  }

  // after the component is rendered
  componentDidMount() {

    // get the user that logged in if they exist
    const username = localStorage.getItem('username')
    axios.get(`${api_endpoint}v1/users/meal_plan`,{
      headers: {"Authorization":username}
    })
    .then(response => {
      this.setState({ meal_plan: response.data.result });
    }).catch((error) => {
      console.log(error);
    });


    // get the nutrition target
    axios.get(`${api_endpoint}v1/users/nutrition_target`,{
      headers: {"Authorization":username}
    })
    .then(response => {
      this.setState({ nutrition_target: response.data.result });
    }).catch((error) => {
      console.log(error);
    });

    // add the dynamically changing week
    const weekString = getWeekString()
    this.setState({ week: weekString})

    // clear the serach result
    Store.clearResultList()
  }

  // this function is called when user confirms that they want to remove a recipe from their meal plan
  // removes the recipe from their meal plan
  removeEntry() {
    const { meal_plan, removal_meal_index, removal_day } = this.state

    // only removes the entry if the card's ID is correct
    if (removal_meal_index !== 'undefined' && removal_day !== 'undefined' && removal_meal_index !== '' && removal_day !== '') {
      meal_plan[removal_meal_index][removal_day] = {}
    }

    this.save_my_plan()
    this.closeRemoveModal()
  }


  /**
   * This opens the modal for user to confirm whether they would really like to remove a meal.
   * This function saves the time and the date of the recipe for removeEntry to use if required.
   *
   * @param {Event} e Event after clicking the x button on a recipe.
   *
   */
  openRemoveModal(e) {
    this.setState({ modal_confirm_visible: true })

    let cardIdParsed = e.target.parentNode.parentNode.id.split('-');
    // if the target happens to be the wrapper of the button
    // happens if you tap the edge
    if (e.target.tagName === 'svg') {
      cardIdParsed = e.target.parentNode.id.split('-');
    }

    const meal_index = cardIdParsed[0]
    const day = cardIdParsed[1]
    this.setState({ modal_confirm_visible: true, removal_meal_index: meal_index, removal_day: day });
  }

  // closes the remove recipe modal
  closeRemoveModal() {
    this.setState({ modal_confirm_visible: false });
  }

  // save the meal schedule to the database
  save_my_plan() {
    const { meal_plan } = this.state

    // get the user that logged in if they exist
    const username = localStorage.getItem('username')

    // send meal plan to backend
    axios.post(`${api_endpoint}v1/users/meal_plan`, {
      'new_plan': meal_plan,
    },
    {
      headers: {"Authorization": username},
    })
    .then(response => {
      this.setState({meal_plan: response.data.result});
    })
    .catch((error) => {
      console.log(error);
    });
  }

    /**
   * This function is called by the modal to add a new plan to the meal planner.
   *
   * @param {Object} recipe Includes all recipe information required to display on the meal planner: id, title, description.
   * @param {String} meal_time Either Breakfast, Lunch or Dinner. Time that the user wants to make the meal.
   * @param {Array} days Array of all the days in the week.
   * 
   */
  add_new_plan(recipe, meal_time, days) {
    const { meal_plan } = this.state
    const new_plan = []

    // make a deep copy here
    for (let i = 0; i < meal_plan.length; i += 1){
      new_plan.push(meal_plan[i])
    }

    const meal_2_int = {'Breakfast':0, 'Lunch':1, 'Dinner':2}

    // get the image of the recipe
    let meal_image = null;
    axios.get(`${api_endpoint}v1/recipes/${recipe.id}`, {
      "Access-Control-Allow-Origin": "*",
      "withCredentials": true,
    }).then(response => {
      if (response.data.result.mediaURL.type === 'image') {
        meal_image = response.data.result.mediaURL.url
      }

      // store into meal plan
      for(let i = 0; i < days.length; i += 1) {

        const meal_index = meal_2_int[meal_time];
        const day = days[i];

        new_plan[meal_index][day] = {
            'recipe_title': recipe.title,
            'description': recipe.description,
            'recipe_id': recipe.id,
            'image': meal_image,
            'meal_index': meal_index,
            'day': day
          }
      }

      this.save_my_plan()
    })
  }

  // sets the nutrition target
  update_nutrition(value) {
    this.setState({ nutrition_target: value });
  }

  /**
   * Either updates a box for the Nutrition Targets or a Recipe.
   *
   * @param {Object} text Includes textual information for each recipe or nutrition target. For recipe, includes: recipe_title, meal_index, day, description, image.
   * For nutrition target, includes: Calories, Carbon, Fibre.
   * 
   */
  render_column_func(text) {

    // for recipe cards
    if(text !== undefined && text.recipe_title !== undefined) {
      const url = `/recipe/${text.recipe_id}`
      const cardId = `${text.meal_index}-${text.day}`;

      return (
        <Card
          hoverable
          href={url}
          cover={
            <img
            alt='recipe'
            style={{ cursor: 'default' }}
            width={200}
            src={text.image}
          />
          }
          style={{ overflow:'hidden'}}
        >
          <CloseSquareFilled id={cardId} onClick={this.openRemoveModal} style={{ zIndex: 99, position: 'absolute', top: '0', right: '0', backgroundColor: 'white'}}/>
          <Link to={url}>
            <Meta title={text.recipe_title} description={text.description} />
          </Link>
        </Card>
      )
    }

    // for nutrition target cards
    if(text !== undefined && text.Calories !== undefined) {
      const {nutrition_target} = this.state

      // go throught 3 entries to see if the nutrition reached
      // if reach then give the checkup
      const temp_func = (cur, target) => {
        if(cur >=  target) return [<CheckCircleTwoTone twoToneColor="#52c41a" />]
        return []
      }

      return (
        <Card>
          Calories: {text.Calories} / {nutrition_target.calories}  {temp_func(text.Calories, nutrition_target.calories)}
          <br />
          Carbon: {text.Carbon} / {nutrition_target.carbon}  {temp_func(text.Carbon, nutrition_target.carbon)}
          <br />
          Fiber: {text.Fiber} / {nutrition_target.fiber}  {temp_func(text.Fiber, nutrition_target.fiber)}
        </Card>
      )
    }

    return []
  }

  render() {
    const { meal_plan, columns, week } = this.state;

    return(
      <Card>
        <Modal
          title="Confirm Meal Removal"
          visible={this.state.modal_confirm_visible}
          width={600}
          footer={null}
          onCancel={this.closeRemoveModal}
        >
          <Alert
            message="Removing any meals will reset your shopping list. Are you sure?"
            description="All ticked items will become unticked."
            type="warning"
            showIcon
          />
          <div style={{ paddingTop: '20px', margin: 'auto', display: 'table' }}>
            <Button style={{ marginRight: '20px' }} onClick={this.closeRemoveModal}>Cancel</Button>
            <Button onClick={this.removeEntry}>Yes. Remove it.</Button>
          </div>
        </Modal>
        <PageHeader
          title="Meal Planner"
          onBack={() => window.history.back()}
          subTitle={<span>Plan your next meal. The ingredients you have to shop for will be in your 
            <Link to='/shopping-list'>shopping list</Link>!</span>}
        />

        <Card style={{ marginTop: '50px'}}>
          <Title level={2} style={{float: 'left', paddingTop: '10px', paddingLeft: '10px'}}>
            {week}
          </Title>
          <NutritionTarget update_nutrition={this.update_nutrition}/>
          <MealConfig newItemFunc={this.add_new_plan}/>
        </Card>

        <Table pagination={false} tableLayout='fixed' columns={columns} dataSource={meal_plan} bordered />
      </Card>
    )
  }
}


export default MealPlanner;
