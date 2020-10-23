import React, {PureComponent } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import styles from './Welcome.less';

class WelcomePage extends PureComponent {
  constructor(props) {
    super(props);
    // console.log(props)

    const { match } = this.props
    // console.log(match)
    const { params } = match
    console.log(params)
    const { recipe_id } = params
    console.log(recipe_id)
    // this.add_new_plan = this.add_new_plan.bind(this);

    // this.state = {
    //   'meal_plan': data,
    //   'columns': columns,
    // };
  }

  render(){
    return(
      <Card>
        <Alert
          message="ECE444 Group3 Quaranteam"
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          Main Page
        </Typography.Text>
      </Card>
    )
  }
}

export default WelcomePage