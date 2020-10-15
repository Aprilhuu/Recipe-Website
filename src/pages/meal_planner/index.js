import React, {PureComponent } from 'react';

import { Table, Tag, Space, Card } from 'antd';
import MealConfig from './mealConfig.jsx'

const render_column_func = function(text, record){
  if(text != undefined && text.recipe_title != undefined){
    return (
      <Card title={text.recipe_title} extra={<a href="#">See Recipe</a>}>
        <h3>Description</h3>
        <p>{text.description}</p>
      </Card>
    )
  }
}

const columns = [
  {
    title: 'Meals',
    dataIndex: 'Meals',
    key: 'Meals',
  },
  {
    title: 'Monday',
    dataIndex: 'Monday',
    key: 'Monday',
    render: render_column_func
  },
  {
    title: 'Tuesday',
    dataIndex: 'Tuesday',
    key: 'Tuesday',
    render: render_column_func
  },
  {
    title: 'Wednesday',
    dataIndex: 'Wednesday',
    key: 'Wednesday',
    render: render_column_func
  },
  {
    title: 'Thursday',
    dataIndex: 'Thursday',
    key: 'Thursday',
    render: render_column_func
  },
  {
    title: 'Friday',
    dataIndex: 'Friday',
    key: 'Friday',
    render: render_column_func
  },
  {
    title: 'Saturday',
    dataIndex: 'Saturday',
    key: 'Saturday',
    render: render_column_func
  },
  {
    title: 'Sunday',
    dataIndex: 'Sunday',
    key: 'Sunday',
    render: render_column_func
  }
];


const data = [
    {'key':1, 'Meals':'Breakfast'},
    {'key':2, 'Meals':'Lunch'},
    {'key':3, 'Meals':'Dinner'}
  ];
// for now, use the fake data
for(var i = 0; i < data.length; i++){
  for(var j = 1; j < columns.length; j++){
    // get the day names
    var day_name = columns[j]['title']
    // add the placeholder
    if(j == 7){
      data[i][day_name] = {'recipe_title':'Spicy Beef', 'description':'More Protein on Sunday'}
    }
    else{
      data[i][day_name] = ''
    }
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

  add_new_plan(t){
    var {meal_plan} = this.state
    var new_plan = []

    // make a deep copy here
    for (var i = 0; i < meal_plan.length; i++){
      new_plan.push(meal_plan[i])
    }

    // for now, use the fake data
    for(var i = 0; i < new_plan.length; i++){
      for(var j = 1; j < columns.length; j++){
        // get the day names
        var day_name = columns[j]['title']
        // add the placeholder
        if(j == 6){
          new_plan[i][day_name] = {'recipe_title':'Spicy Beef', 'description':'More Protein on Sunday'}
        }
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

    console.log(meal_plan)

    return(
      <Card>
        <MealConfig newItemFunc={this.add_new_plan}/>
        <Table columns={columns} dataSource={meal_plan} bordered />
      </Card>
    )
  }
}


export default MealPlanner;
