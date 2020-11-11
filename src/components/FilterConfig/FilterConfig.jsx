import React, {PureComponent} from 'react';
import {Button, Form, InputNumber, Modal, Typography,} from 'antd';
import IngredientTag from './IngredientTag';

const { Title } = Typography;

/* Formatting */
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

// https://quaranteam-group3.atlassian.net/browse/CCP-36
class FilterConfig extends PureComponent {
  state = {
    visible: false,
    ingredientsTagsList: [],
    calorieLimit: -1,
    timeLimit: -1,
  };

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.updateTags = this.updateTags.bind(this);
  }

  /* For Modal View */
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  onChangeCalorie = (value) => {
    this.setState({
      calorieLimit: value
    })
  }

  onChangeTime = (value) => {
    this.setState({
      timeLimit: value
    })
  }

  closeForm() {
    this.setState({
      visible: false,
    });
  }

  onSubmit = () => {
    //close the modal
    this.setState({
      visible: false,
    });

    console.log(this.state.calorieLimit)
    console.log(this.state.timeLimit)
  }

  updateTags(inputTags) {
    let ingredientsTagsList = inputTags;
    this.setState({
      ingredientsTagsList,
    });
  }

  render() {
    return (
      /* Modal view */
      <>
        <Button type="primary" onClick={this.showModal}>
          Add Filter
        </Button>
        <Modal
          title="Filter Configuration"
          visible={this.state.visible}
          onOk={this.onSubmit}
          onCancel={this.closeForm}
        >
          <Form
            {...layout}
            name="basic"
            initialValues={{
              remember: false,
            }}
            preserve={false}
          >
            {/* Ingredient Exclude input tags */}
            <Form.Item>
              <Title level={5}>Enter ingredients to EXCLUDE: </Title>
              <IngredientTag updateIngredientsTagsList={this.updateTags} />
            </Form.Item>

            {/* Calorie per serving limit */}
            <Title level={5}>Enter a calorie limit per serving: </Title>
            <Form.Item>
              <Form.Item name="calorieLimit" noStyle>
                <InputNumber min={0} onChange={this.onChangeCalorie}/>
              </Form.Item>
            </Form.Item>

            {/* Time limit */}
            <Title level={5}>Enter a meal preparation time limit (mins): </Title>
            <Form.Item>
              <Form.Item name="timeLimit" noStyle>
                <InputNumber min={0} onChange={this.onChangeTime}/>
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default FilterConfig;
