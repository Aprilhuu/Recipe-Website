import React, {PureComponent } from 'react';
import axios from 'axios';
import { Table, PageHeader, Card, Typography, Modal, Button, Alert } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import MealConfig from './mealConfig.jsx'
import NutritionTarget from './nutritionTarget.js'
import { Link } from 'umi';
import { CloseSquareFilled } from '@ant-design/icons';
const { Title } = Typography;
const { Meta } = Card;
import Store from "../storage";

import defaultSettings from '../../../config/defaultSettings';
const { api_endpoint } = defaultSettings

// https://quaranteam-group3.atlassian.net/browse/CCP-3
class MealPlanner extends PureComponent {
  constructor(props) {

    super(props);

    this.closeForm = this.closeForm.bind(this);
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

  openRemoveModal(e) {
    this.setState({
      modal_confirm_visible: true
    })

    let cardIdParsed = e.target.parentNode.parentNode.id.split('-');
    // if the target happens to be the wrapper of the button
    // happens if you tap the edge
    if (e.target.tagName == 'svg') {
      cardIdParsed = e.target.parentNode.id.split('-');
    }

    const meal_index = cardIdParsed[0]
    const day = cardIdParsed[1]
    this.setState({ modal_confirm_visible: true, removal_meal_index: meal_index, removal_day: day});
  }

  removeEntry() {
    let { meal_plan, removal_meal_index, removal_day } = this.state

    // only removes the entry if the card's ID is correct
    if (removal_meal_index != 'undefined' && removal_day != 'undefined' && removal_meal_index != '' && removal_day != '') {
      meal_plan[removal_meal_index][removal_day] = {}
    }

    this.save_my_plan()
    this.closeForm()
  }

  render_column_func(text, record) {
    if(text != undefined && text.recipe_title != undefined){

      var url = "/recipe/" + text.recipe_id
      const cardId = text.meal_index + '-' + text.day;

      return (
        <Card
          hoverable
          href={url}
          cover={
            <img
            style={{ cursor: 'default' }}
            width={200}
            src={text.image}
          />
          }
          style={{ overflow:'hidden'}}
        >
          <CloseSquareFilled id={cardId} onClick={this.openRemoveModal.bind(this)} style={{ zIndex: 99, position: 'absolute', top: '0', right: '0', backgroundColor: 'white'}}/>
          <Link to={url}>
            <Meta title={text.recipe_title} description={text.description} />
          </Link>
        </Card>
      )
    }
    else if(text != undefined && text.Calories != undefined){
      const {nutrition_target} = this.state

      // go throught 3 entries to see if the nutrition reached
      // if reach then give the checkup
      const temp_func = (cur, target) => {
        if(cur >=  target) return [<CheckCircleTwoTone twoToneColor="#52c41a" />]
        else return []
      }

      return (
        <Card>
          Calories: {text.Calories} / {nutrition_target['calories']}  {temp_func(text.Calories, nutrition_target['calories'])}
          <br />
          Carbon: {text.Carbon} / {nutrition_target['carbon']}  {temp_func(text.Carbon, nutrition_target['carbon'])}
          <br />
          Fiber: {text.Fiber} / {nutrition_target['fiber']}  {temp_func(text.Fiber, nutrition_target['fiber'])}
        </Card>
      )
    }
  }

  // https://stackoverflow.com/questions/5210376/how-to-get-first-and-last-day-of-the-week-in-javascript
  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  getDateString(date) {
    const dateData = date.toString().split(' ');
    const dateString = dateData[0] + 'day, ' + dateData[1] + ' ' + dateData[2] + ' ' + dateData[3];
    return dateString;
  }

  getWeekString() {
    const daysOfPlan = 7
    let curDate = new Date;

    const startDate = this.getMonday(curDate);
    const endDate = new Date(startDate.getTime() + (daysOfPlan - 1) * 86400000 );

    const startDateString = this.getDateString(startDate);
    const endDateString = this.getDateString(endDate);

    const weekString = startDateString + ' - ' + endDateString;

    return weekString;
  }

  closeForm(){
    this.setState({
      modal_confirm_visible: false,
    });
  }

  // after the component is rendered
  componentDidMount() {
    // get the user that logged in if they exist
    const username = localStorage.getItem('username')
    console.log(username)

    axios.get(api_endpoint+'v1/users/meal_plan',{
      headers: {"Authorization":username}
    })
    .then(response => {
      this.setState({meal_plan: response['data']['result']});
      // this.load_nutrition(response['data']['result'])
    }).catch(function (error) {
      console.log(error);
    });


    // get the nutrition target
    axios.get(api_endpoint+'v1/users/nutrition_target',{
      headers: {"Authorization":username}
    })
    .then(response => {
      console.log(response['data']['result']);
      this.setState({nutrition_target: response['data']['result']});
    }).catch(function (error) {
      console.log(error);
    });

    // add the dynamically changing week
    const weekString = this.getWeekString()
    this.setState({ week: weekString})
    Store.clearResultList()
  }


  // save the schedule to the database
  save_my_plan(){
    var { meal_plan } = this.state

    // get the user that logged in if they exist
    const username = localStorage.getItem('username')

    // send meal plan to backend
    axios.post(api_endpoint+'v1/users/meal_plan', {
      'new_plan': meal_plan,
    },
    {
      headers: {"Authorization": username},
    })
    .then(response => {
      this.setState({meal_plan: response['data']['result']});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  add_new_plan(recipe, meal_time, days){
    var { meal_plan } = this.state
    var new_plan = []

    // make a deep copy here
    for (var i = 0; i < meal_plan.length; i++){
      new_plan.push(meal_plan[i])
    }

    const meal_2_int = {'Breakfast':0, 'Lunch':1, 'Dinner':2}

    // get the image of the recipe
    let meal_image = null;
    axios.get(api_endpoint + 'v1/recipes/' + recipe.id, {
      "Access-Control-Allow-Origin": "*",
      "withCredentials": true,
    }).then(response => {
      if (response.data.result.mediaURL.type == 'image') {
        meal_image = response.data.result.mediaURL.url
      }

      // store into meal plan
      for(var i = 0; i < days.length; i++) {

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

  update_nutrition(value){
    this.setState({ nutrition_target: value });
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
          onCancel={this.closeForm}
        >
          <Alert
            message="Removing any meals will reset your shopping list. Are you sure?"
            description="All ticked items will become unticked."
            type="warning"
            showIcon
          />
          <div style={{ paddingTop: '20px', margin: 'auto', display: 'table' }}>
            <Button style={{ marginRight: '20px' }} onClick={this.closeForm}>Cancel</Button>
            <Button onClick={this.removeEntry}>Yes. Remove it.</Button>
          </div>
        </Modal>
        <PageHeader
            title="Meal Planner"
            onBack={() => window.history.back()}
            subTitle={<span>Plan your next meal. The ingredients you have to shop for will be in your <a href='shopping-list'>shopping list</a>!</span>}
        ></PageHeader>

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
