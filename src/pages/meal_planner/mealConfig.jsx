import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Checkbox,
  Row,
  Col,
} from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const rangeConfig = {
  rules: [
    {
      type: 'array',
      required: true,
      message: 'Please select time!',
    },
  ],
};

class MealConfig extends PureComponent {
  constructor(props) {
    super(props);

    const { newItemFunc } = this.props;

    this.onFinish = this.onFinish.bind(this);

    // console.log(newItemFunc)

    this.state = {
      recipe: 'sample recipe',
      //dateAndTime: fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
      // need to update all state values
    };
  }

  onFinish(values){
    console.log('Success:', values);
    // update the name of attribute later
    var recipe = values['recipe']
    var meal = values['meal-time-picker']
    // const days_to_int = {"monday":1,"tuesday":2,"wednesday":3,"thursday":4,"friday":5,"saturday":6,"sunday":7}
    var days = values['checkbox-group']


    const { newItemFunc } = this.props;
    newItemFunc(recipe, meal, days)
  }

  render() {
    return (
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={this.onFinish}
      >
        <Form.Item
          label="Select Recipe"
          name="recipe"
          rules={[
            {
              required: true,
              message: 'Please choose a recipe',
            },
          ]}
        >
          <Select>
            <Select.Option value="recipe1">Recipe1</Select.Option>
            handler
          </Select>
        </Form.Item>

        <Form.Item
          name="checkbox-group"
          label="Day(s) of the week"
          rules={[
            {
              required: true,
              message: 'Please select at least one day',
            },
          ]}
        >
          <Checkbox.Group>
            <Row>
              <Col span={8}>
                <Checkbox
                  value="sunday"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  Sunday
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="monday"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  Monday
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="tuesday"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  Tuesday
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="wednesday"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  Wednesday
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="thursday"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  Thursday
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="friday"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  Friday
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox
                  value="saturday"
                  style={{
                    lineHeight: '32px',
                  }}
                >
                  Saturday
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          name="meal-time-picker"
          label="Meal Time"
          rules={[
            {
              required: true,
              message: 'Please select a meal time',
            },
          ]}
        >
          <Select>
            <Select.Option value="Breakfast">Breakfast</Select.Option>
            <Select.Option value="Lunch">Lunch</Select.Option>
            <Select.Option value="Dinner">Dinner</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="range-picker" label="Duration of Meal" {...rangeConfig}>
          <RangePicker />
        </Form.Item>

        <Form.Item name="noifications" label="Enable Notifications" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default MealConfig;
