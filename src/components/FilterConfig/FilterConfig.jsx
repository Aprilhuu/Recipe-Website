import React, {PureComponent} from 'react';
import {Button, Form, InputNumber, Modal, Typography,} from 'antd';
import IngredientTag from './IngredientTag';
import axios from "axios";
import defaultSettings from "../../../config/defaultSettings";

const { api_endpoint } = defaultSettings;

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
    timeLimit: -1
  };

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.updateTags = this.updateTags.bind(this);
    this.searchCriteria = props.searchCriteria;
    this.handleFilter = props.handleFilter;
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

    const filter = {};
    if (this.state.ingredientsTagsList){
      filter["exclude"] = this.state.ingredientsTagsList;
    }
    if (this.state.calorieLimit !== -1){
      filter["calorieLimit"] = this.state.calorieLimit;
    }
    if (this.state.timeLimit !== -1){
      filter["timeLimit"] = this.state.timeLimit * 60;
    }

    let searchJSON;
    const currentCriteria = this.searchCriteria();
    if (typeof currentCriteria === "object"){
      searchJSON = {"ingredients": currentCriteria, "filters": filter};
    }
    else if (typeof currentCriteria === "string"){
      searchJSON = {"title": currentCriteria, "filters": filter};
    }

    axios.post(api_endpoint +'/v1/recipes/query', searchJSON )
      .then(response =>{
        this.handleFilter(response['data']['result']);
      })

    //close the modal
    this.setState({
      visible: false,
    });

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
        <Button type="primary" onClick={this.showModal} style={{marginBottom: '16px'}}>
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
              <Title level={5}>EXCLUDE ingredients: </Title>
              <IngredientTag updateIngredientsTagsList={this.updateTags} />
            </Form.Item>

            {/* Calorie per serving limit */}
            <Title level={5}>Enter a calorie limit per serving: </Title>
            <Form.Item>
              <Form.Item name="calorieLimit" noStyle>
                <InputNumber min={0} onChange={this.onChangeCalorie}/>
                <span style={{marginLeft: '8px'}}>kcal</span>
              </Form.Item>
            </Form.Item>

            {/* Time limit */}
            <Title level={5}>Enter a meal preparation time limit: </Title>
            <Form.Item>
              <Form.Item name="timeLimit" noStyle>
                <InputNumber min={0} onChange={this.onChangeTime}/>
                <span style={{marginLeft: '8px'}}>hour(s)</span>
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default FilterConfig;
