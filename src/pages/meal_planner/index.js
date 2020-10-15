import React from 'react';

import { Table, Tag, Space, Card } from 'antd';

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
  },
  {
    title: 'Tuesday',
    dataIndex: 'Tuesday',
    key: 'Tuesday',
  },
  {
    title: 'Wednesday',
    dataIndex: 'Wednesday',
    key: 'Wednesday',
  },
  {
    title: 'Thursday',
    dataIndex: 'Thursday',
    key: 'Thursday',
  },
  {
    title: 'Friday',
    dataIndex: 'Friday',
    key: 'Friday',
  },
  {
    title: 'Saturday',
    dataIndex: 'Saturday',
    key: 'Saturday',
  },
  {
    title: 'Sunday',
    dataIndex: 'Sunday',
    key: 'Sunday',
    render: (text, record) => (
      <Card title={text.recipe_title} extra={<a href="#">See Recipe</a>}>
        <h3>Description</h3>
        <p>{text.description}</p>
      </Card>
    )
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
      data[i][day_name] = {'recipe_title':'Spicy Beef', 'description':'More Potien on Sunday'}
    }
    else{
      data[i][day_name] = ''
    }
  }
}

console.log(data)


export default () => (
  <Card>
      <Table columns={columns} dataSource={data} bordered />
  </Card>
);
