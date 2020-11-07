import React, {PureComponent } from 'react';
import axios from 'axios';
import { Table, PageHeader, Card, Button, Typography } from 'antd';
import MealConfig from './mealConfig.jsx'
import { Link } from 'umi';
import { CloseSquareFilled } from '@ant-design/icons';
const { Title } = Typography;
const { Meta } = Card;

import defaultSettings from '../../../config/defaultSettings';
const {api_endpoint} = defaultSettings

// const data = [
//     {'key':1, 'meals':'Breakfast'},
//     {'key':2, 'meals':'Lunch'},
//     {'key':3, 'meals':'Dinner'}
//   ];
// // for now, use the fake data
// for(var i = 0; i < data.length; i++){
//   for(var j = 1; j < columns.length; j++){
//     // get the day names
//     var day_name = columns[j]['dataIndex']
//     // add the placeholder
//     data[i][day_name] = ''
//   }
// }

// console.log(data)

// https://quaranteam-group3.atlassian.net/browse/CCP-3
class MealPlanner extends PureComponent {
  constructor(props) {
    super(props);

    this.add_new_plan = this.add_new_plan.bind(this);
    this.save_my_plan = this.save_my_plan.bind(this);
    this.onClick = this.onClick.bind(this);
    this.render_column_func = this.render_column_func.bind(this);

    this.state = {
      // 'meal_plan': data,
      'columns': [
        {
          title: 'Meal Time',
          dataIndex: 'meals',
          key: 'meals',
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
    };

    
  }

  onClick(e) {
    const cardIdParsed = e.target.parentNode.parentNode.id.split('-');
    const meal_index = cardIdParsed[0]
    const day = cardIdParsed[1]

    let { meal_plan } = this.state

    if (meal_index != 'undefined' && day != 'undefined' && meal_index != '' && day != '') {
      console.log(meal_index == '')
      console.log(meal_index)
      console.log(day)
      meal_plan[meal_index][day] = {}
      this.setState({ mealplan: meal_plan })
    }
  }
  
  render_column_func(text, record) {
  
    if(text != undefined && text.recipe_title != undefined){
  
      // need to return more than just the name
      var url = "/recipe/"+text.recipe_id
      const cardId = text.meal_index + '-' + text.day;
  
      return (
          <Card
            hoverable
            href={url}
            cover={
              <img
              style={{ cursor: 'default' }}
              width={200}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
            }
            style={{overflow:'hidden'}}
          >
            <Link to={url}>
              <Meta title={text.recipe_title} description="Placeholder" />
            </Link>
            <CloseSquareFilled id={cardId} onClick={this.onClick.bind(this)} style={{ zIndex: 99, position: 'absolute', top: '2px', right: '2px', backgroundColor: 'white'}}/>
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

  // after the component is rendered
  componentDidMount(){
    // get logined user if exist
    const username = localStorage.getItem('username')
    console.log(username)

    axios.get(api_endpoint+'v1/users/meal_plan',{
      headers: {"Authorization":username}
    })
    .then(response =>{
      this.setState({meal_plan: response['data']['result']});
      console.log(this.state.meal_plan)
    }).catch(function (error) {
      console.log(error);
    });
    
    const weekString = this.getWeekString()
    this.setState({ week: weekString})
  }


  // save the schedule to the database
  save_my_plan(){
    var {meal_plan} = this.state
    // get logined user if exist
    const username = localStorage.getItem('username')

    // send to backend
    axios.post(api_endpoint+'v1/users/meal_plan', {
      'new_plan': meal_plan,
    },
    {
      headers: {"Authorization": username},
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  add_new_plan(recipe, meal_time, days){
    var {meal_plan} = this.state
    var new_plan = []

    // make a deep copy here
    for (var i = 0; i < meal_plan.length; i++){
      new_plan.push(meal_plan[i])
    }

    const meal_2_int = {'Breakfast':0, 'Lunch':1, 'Dinner':2}
    for(var i = 0; i < days.length; i++){

      const meal_index = meal_2_int[meal_time];
      const day = days[i];

      new_plan[meal_index][day] = {
          'recipe_title':recipe.title, 
          'description':recipe.description,
          'recipe_id': recipe.id,
          'meal_index': meal_index,
          'day': day
        }
    }

    this.setState({
      meal_plan: new_plan,
    });
  }

  render() {
    const { meal_plan, columns, week } = this.state;

    return(
      <Card>
        <PageHeader
            title="Meal Planner"
            onBack={() => window.history.back()}
            subTitle={<span>Plan your next meal. The ingredients you have to shop for will be in your <a href='shopping-list'>shopping list</a>!</span>}
        ></PageHeader>

        <Card style={{ marginTop: '50px'}}>
          <Title level={2} style={{float: 'left', paddingTop: '10px', paddingLeft: '10px'}}>
            {week}
          </Title>
          <MealConfig newItemFunc={this.add_new_plan}/>
          <Button></Button>
        </Card>

        <Table pagination={false} tableLayout='fixed' columns={columns} dataSource={meal_plan} bordered />

      </Card>
    )
  }

  componentWillUnmount() {
    this.save_my_plan()
  }
}


export default MealPlanner;
