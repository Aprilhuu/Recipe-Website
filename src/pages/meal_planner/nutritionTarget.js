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
    };
  }

  // after the component is rendered
  componentDidMount(){

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
    console.log('Success:', values);
    // const {recipes} =  this.state
    // // console.log( recipes )
    // // console.log(' get here')

    // // update the name of attribute later
    // var recipe_id = values['recipe'];
    // var rp = recipes[recipe_id]
    // // console.log(rp)

    // var meal = values['meal-time-picker'];
    // // const days_to_int = {"monday":1,"tuesday":2,"wednesday":3,"thursday":4,"friday":5,"saturday":6,"sunday":7}
    // var days = values['checkbox-group'];

    // //close the modal
    // this.setState({
    //   visible: false,
    // });

    // const { newItemFunc } = this.props;
    // newItemFunc(rp, meal, days);
  }

  render() {


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
            <Form.Item name="calories_input" label="Calories(0~1000): ">
              <InputNumber 
                min={0} 
                max={1000} 
                defaultValue={0} 
                step={100}
                formatter={value => `${value}kj`}
                parser={value => value.replace('kj', '')}
              />
            </Form.Item>
            <Form.Item name="carbon_input" label="Carbon(0~200): " >
              <InputNumber 
                min={0} 
                max={200} 
                defaultValue={0} 
                step={10}
                formatter={value => `${value}g`}
                parser={value => value.replace('g', '')}
              />
            </Form.Item>
            <Form.Item name="fiber_input" label="Fiber(0~50): " >
              <InputNumber 
                min={0} 
                max={50} 
                defaultValue={0} 
                step={1}
                formatter={value => `${value}g`}
                parser={value => value.replace('g', '')}
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
