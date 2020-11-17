/* eslint-disable no-restricted-syntax */
import React, { PureComponent } from 'react';
import { Form, Button, Select, Checkbox, Row, Col, Modal, Alert } from 'antd';
import axios from 'axios';
import defaultSettings from '../../../config/defaultSettings';

const { Option } = Select;
const {api_endpoint} = defaultSettings

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

// https://quaranteam-group3.atlassian.net/browse/CCP-6
class MealConfig extends PureComponent {

  constructor(props) {
    super(props);

    this.onFinish = this.onFinish.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.state = { 
      'visible': false ,
      'recipes': [],
      'days': []
    };

    this.daysInfo = {
      'Sunday': 'sunday',
      'Monday': 'monday', 
      'Tuesday': 'tuesday',
      'Wednesday': 'wednesday',
      'Thursday': 'thursday',
      'Friday': 'friday', 
      'Saturday': 'saturday'}
  }

  componentDidMount() {
    // add modal days checkboxes
    const days = []
    for (const [key, value] of Object.entries(this.daysInfo)) {
      days.push(<Col key={key+'_'+value} span={8}>
        <Checkbox
          value={value}
          style={{
            lineHeight: '32px',
          }}
        />
        <span style={{paddingLeft: '10px'}}>{key}</span>
      </Col>)
    }
    this.setState({ days })
  }

  // save the added in the modal
  onFinish(values) {
    const { recipes } =  this.state

    // update the name of attribute later
    const recipe_id = values.recipe;
    const rp = recipes[recipe_id]

    const meal = values['meal-time-picker'];
    const days = values['checkbox-group'];

    // close the modal
    this.setState({
      visible: false,
    });

    const { newItemFunc } = this.props;
    newItemFunc(rp, meal, days);
  }

  // shows the add meal modal
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  // closes the add meal modal
  closeForm = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * This function runs letters through the meal planner's query to look for recipes that begin with a certain letter.
   *
   * @param {String} value Letter or letters input into the search bar to search recipe by name.
   *
   */
  handleSearch(value) {
    // this api needs to return the recipes
    axios.post(`${api_endpoint}v1/recipes/query/meal_plan`, {'title': value},
    {
      "Access-Control-Allow-Origin": "*",
      "withCredentials": true,
    })
    .then(response => {
      this.setState({
        recipes: response.data.result,
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    // start to prepare the drop down
    const { recipes } =  this.state
    const recipeList = []
    for (let i = 0; i < recipes.length; i += 1) {
      recipeList.push(
        <Option key={i} value={i}>
          {recipes[i].title}
        </Option>,
      );
    }

    return (
      <div>
        <Button style={{float: 'right', marginTop: '20px', marginRight: '20px'}} type="primary" onClick={this.showModal}>
          Add Meal
        </Button>
        <Modal
          title="Meal Configuration"
          visible={this.state.visible}
          width={600}
          footer={null}
          onCancel={this.closeForm}
        >
          <Alert
            message="Adding any new meals will reset your shopping list."
            description="All ticked items will become unticked."
            type="warning"
            showIcon
          />
          <Form
            style={{ paddingTop: '20px'}}
            {...layout}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            preserve={false}
          >
            <Form.Item
              label="Search Recipe"
              name="recipe"
              rules={[
                {
                  required: true,
                  message: 'Please choose a recipe',
                },
              ]}
            >
              <Select
                showSearch
                defaultActiveFirstOption={false}
                placeholder="eg. Chicken"
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                notFoundContent={null}
              >
                {recipeList}
              </Select>
            </Form.Item>

            {/* Select days of the week */}
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
              <Checkbox.Group style={{ width: '100%' }}> 
                <Row >
                  {this.state.days}
                </Row>
              </Checkbox.Group>
            </Form.Item>

            {/* Select Meal Time */}
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
              <Select placeholder="e.g. Breakfast">
                <Select.Option value="Breakfast">Breakfast</Select.Option>
                <Select.Option value="Lunch">Lunch</Select.Option>
                <Select.Option value="Dinner">Dinner</Select.Option>
              </Select>
            </Form.Item>

            {/* Save button */}
            <Form.Item {...tailLayout}>
              <Button style={{marginTop: '20px'}} type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default MealConfig;
