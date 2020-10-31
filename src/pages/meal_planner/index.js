import React, {PureComponent } from 'react';

import { Table, Tag, Space, Card } from 'antd';
import MealConfig from './mealConfig.jsx'
import { Link } from 'umi';

import defaultSettings from '../../../config/defaultSettings';
const {api_endpoint} = defaultSettings

const render_column_func = function(text, record){
  if(text != undefined && text.recipe_title != undefined){
    var url = "/recipe/"+text.recipe_id
    return (
      <Tag>
        <Link to={url}>{text.recipe_title}</Link>
      </Tag>
    )
  }
}

const columns = [
  {
    title: 'Meals',
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


const data = [
    {'key':1, 'meals':'Breakfast'},
    {'key':2, 'meals':'Lunch'},
    {'key':3, 'meals':'Dinner'}
  ];
// for now, use the fake data
for(var i = 0; i < data.length; i++){
  for(var j = 1; j < columns.length; j++){
    // get the day names
    var day_name = columns[j]['dataIndex']
    // add the placeholder
    data[i][day_name] = ''
  }
}

console.log(data)

// https://quaranteam-group3.atlassian.net/browse/CCP-3
class MealPlanner extends PureComponent {
  constructor(props) {
    super(props);

    this.add_new_plan = this.add_new_plan.bind(this);

    this.state = {
      'meal_plan': data,
      'columns': columns,
    };
  }

  add_new_plan(recipe, meal, days){
    var {meal_plan} = this.state
    var new_plan = []

    console.log(recipe, meal, days)

    // make a deep copy here
    for (var i = 0; i < meal_plan.length; i++){
      new_plan.push(meal_plan[i])
    }

    const meal_2_int = {'Breakfast':0, 'Lunch':1, 'Dinner':2}
    for(var i = 0; i<days.length; i++){
      // console.log(days[i])
      new_plan[meal_2_int[meal]][days[i]] = {
          'recipe_title':recipe.title, 
          'description':'Update meals',
          'recipe_id': recipe.id
        }
    }
    console.log(new_plan)

    // set back
    this.setState({
      meal_plan:new_plan,
    });
  }

  render() {
    const { meal_plan, columns } = this.state;

    // console.log(meal_plan)

    return(
      <Card>
        <MealConfig newItemFunc={this.add_new_plan}/>
        <Table columns={columns} dataSource={meal_plan} bordered />
      </Card>
    )
  }
}


export default MealPlanner;
