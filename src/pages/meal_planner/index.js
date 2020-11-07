import React, {PureComponent } from 'react';
import axios from 'axios';
import { Table, PageHeader, Card, Button, Typography, Image } from 'antd';
import MealConfig from './mealConfig.jsx'
import { Link } from 'umi';
const { Title } = Typography;
const { Meta } = Card;

import defaultSettings from '../../../config/defaultSettings';
const {api_endpoint} = defaultSettings

const render_column_func = function(text, record){
  if(text != undefined && text.recipe_title != undefined){
    // recipe id here is not right
    // need to return more than just the name
    var url = "/recipe/"+text.recipe_id
    return (
      <Card
        hoverable
        cover={
          <Image
          width={200}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
        }
        style={{overflow:'hidden'}}
      >
        <Meta title={<Link to={url}>{text.recipe_title}</Link>} description="Placeholder" />
      </Card>
    )
  }
}

const columns = [
  {
    title: 'Meal Time',
    dataIndex: 'meals',
    key: 'meals',
  },
  {
    title: 'Monday',
    dataIndex: 'monday',
    key: 'monday',
    render: render_column_func
  },
  {
    title: 'Tuesday',
    dataIndex: 'tuesday',
    key: 'tuesday',
    render: render_column_func
  },
  {
    title: 'Wednesday',
    dataIndex: 'wednesday',
    key: 'wednesday',
    render: render_column_func
  },
  {
    title: 'Thursday',
    dataIndex: 'thursday',
    key: 'thursday',
    render: render_column_func
  },
  {
    title: 'Friday',
    dataIndex: 'friday',
    key: 'friday',
    render: render_column_func
  },
  {
    title: 'Saturday',
    dataIndex: 'saturday',
    key: 'saturday',
    render: render_column_func
  },
  {
    title: 'Sunday',
    dataIndex: 'sunday',
    key: 'sunday',
    render: render_column_func
  }
];


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

    this.state = {
      // 'meal_plan': data,
      'columns': columns,
    };
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
      this.setState({
        meal_plan:response['data']['result'],
      });
    }).catch(function (error) {
      console.log(error);
    });
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

  add_new_plan(recipe, meal, days){
    var {meal_plan} = this.state
    var new_plan = []

    // console.log(recipe, meal, days)

    // make a deep copy here
    for (var i = 0; i < meal_plan.length; i++){
      new_plan.push(meal_plan[i])
    }

    const meal_2_int = {'Breakfast':0, 'Lunch':1, 'Dinner':2}
    for(var i = 0; i<days.length; i++){
      // console.log(days[i])
      new_plan[meal_2_int[meal]][days[i]] = {
          'recipe_title':recipe.title, 
          'description':recipe.description,
          'recipe_id': recipe.id
        }
    }
    // console.log(new_plan)

    // set back
    this.setState({
      meal_plan:new_plan,
    });
  }

  render() {
    const { meal_plan, columns } = this.state;

    return(
      <Card>
        <PageHeader
            title="Meal Planner"
            onBack={() => window.history.back()}
            subTitle={<span>Plan your next meal. The ingredients you have to shop for will be in your <a href='shopping-list'>shopping list</a>!</span>}
        ></PageHeader>

        {/* button here for testing purpose */}
        {/* <Button style={{float: 'right'}} onClick={this.save_my_plan}>Save My Plan</Button> */}
        <Card style={{ marginTop: '50px'}}>

          {/* choose week, or just the upcoming week? */}
          <Title level={2} style={{float: 'left', paddingTop: '10px', paddingLeft: '10px'}}>
            The Week Of:
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
