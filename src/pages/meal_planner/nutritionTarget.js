import React, { PureComponent } from 'react';
import { Form, Button, Select, DatePicker, Switch, Checkbox, Row, Col, Modal, InputNumber  } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { RangePicker } = DatePicker;

import defaultSettings from '../../../config/defaultSettings';
const {api_endpoint} = defaultSettings

const layout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

// https://quaranteam-group3.atlassian.net/browse/CCP-6
class NutritionTarget extends PureComponent {

  constructor(props) {
    super(props);

    // const { update_nutrition } = this.props;

    this.onFinish = this.onFinish.bind(this);
    this.closeForm = this.closeForm.bind(this);
    // this.handleSearch = this.handleSearch.bind(this);

    // console.log(newItemFunc)
    this.state = { 
      'visible': false ,
      'nutrition_target': {'calories':0, 'carbon':0, 'fiber':0},  
    };
  }

  // after the component is rendered
  componentDidMount(){
    const username = localStorage.getItem('username')
    // get the nutrition target
    axios.get(api_endpoint+'v1/users/nutrition_target',{
      headers: {"Authorization":username}
    })
    .then(response => {
      this.setState({nutrition_target: response['data']['result']});
    }).catch(function (error) {
      console.log(error);
    });
  }


  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  /* Need to add ability to hit ok, but with save config*/
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  closeForm(e){
    console.log(e);
    this.setState({
      visible: false,
    });
  };


  onFinish(values) {
    const {nutrition_target} = this.state

    // conner case for undefined
    if(values.calories == undefined){
      values.calories = nutrition_target.calories
    }
    if(values.carbon == undefined){
      values.carbon = nutrition_target.carbon
    }
    if(values.fiber == undefined){
      values.fiber = nutrition_target.fiber
    }

    // save to backend
    console.log(values)
    const username = localStorage.getItem('username')
    // get the nutrition target
    axios.post(api_endpoint+'v1/users/nutrition_target', {
      'nutrition_target': values
    }, {
      headers: {"Authorization":username}
    })
    .then(response => {
      this.setState({nutrition_target: response['data']['result']});
    }).catch(function (error) {
      console.log(error);
    });

    // close the form
    this.setState({
      visible: false,
    });

    const { update_nutrition } = this.props;
    update_nutrition(values);
  }

  render() {
    const {nutrition_target} = this.state

    return (
      /* Modal view */
      <div>
        <Button style={{float: 'right', marginTop: '20px'}} type="primary" onClick={this.showModal}>
          Set Nutrition
        </Button>
        <Modal
          title="Nutrition Target"
          visible={this.state.visible}
          // onOk={this.handleOk}
          footer={null}
          onCancel={this.closeForm}
        >

          <Form
            {...layout}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            preserve={false}
          >

            {/* input nutrition */}
            <Form.Item name="calories" label="Calories(0~1000kj): ">
              <InputNumber 
                min={0} 
                max={1000} 
                defaultValue={nutrition_target['calories']} 
                step={100}
              />
            </Form.Item>
            <Form.Item name="carbon" label="Carbon(0~200g): " >
              <InputNumber 
                min={0} 
                max={100} 
                defaultValue={nutrition_target['carbon']}  
                step={10}
              />
            </Form.Item>
            <Form.Item name="fiber" label="Fiber(0~50g): " >
              <InputNumber 
                min={0} 
                max={50} 
                defaultValue={nutrition_target['fiber']}  
                step={1}
              />
            </Form.Item>

            {/* Save button */}
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default NutritionTarget;
