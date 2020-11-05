import React, {PureComponent } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Space, Row, 
        Col, Divider, Form, Checkbox, Radio } from 'antd';
import { Link } from 'umi';
import styles from './login.less'

import defaultSettings from '../../../config/defaultSettings';
const {api_endpoint} = defaultSettings



class UserLogin extends PureComponent {
  constructor(props) {
    super(props);

    this.user_login = this.user_login.bind(this)
    this.logout = this.logout.bind(this)
    this.show_login_modal = this.show_login_modal.bind(this)
    this.close_login_modal = this.close_login_modal.bind(this)
    this.warning = this.warning.bind(this)
    // this.password_update = this.password_update.bind(this)

    const username = localStorage.getItem('username')
    var login_flag = true
    if(username == undefined){
      login_flag = false
    }

    this.state = {
      'show':false,
      // 'username': username,
      // 'password': undefined,
      'login_flag': login_flag,
      'login_success_flag': true,
    };
  }

  // after the component is rendered
  componentDidMount(){
    
  }

  user_login(values){
    const {username, password} = values

    // send to backend
    axios.post(api_endpoint+'v1/users/login', {
      'username': username,
      'password': password,
    },
    {
      "Access-Control-Allow-Origin": "*",
      "withCredentials": true,
    })
    // to use the arrow function let the this within the function scope
    .then(response => {
      console.log(response);

      // if success then set the username into the local storage
      localStorage.setItem('username', username);

      // raise login flag
      this.setState({
        'login_flag':true,
        'show':false,
      })
    }).catch(error => {
      // raise login flag
      this.setState({
        'login_success_flag':false,
      })
    });
  }

  // remove the username in local storage
  logout(){
    localStorage.removeItem('username')
    console.log("logout")
    // send to backend
    // send to backend
    axios.post('http://localhost:5000/'+'v1/users/logout', {},
    {
      "Access-Control-Allow-Origin": "*",
      "withCredentials": true,
    })
    // to use the arrow function let the this within the function scope
    .then(response => {
      console.log(response);

      // if success then set the username into the local storage
      localStorage.setItem('username', username);

      // raise login flag
      this.setState({
        'login_flag':true,
        'show':false,
      })
    }).catch(error => {
      // raise login flag
      this.setState({
        'login_success_flag':false,
      })
    });
  }


  // opent the login modal
  show_login_modal(){
    this.setState({
      'show':true
    })
  }

  // close login modal
  close_login_modal(){
    this.setState({
      'show':false
    })
  }

  // let user to confirm before logout
  warning() {
    Modal.warning({
      title: 'Confirm to Logout',
      content: 'Are you sure to logout?',
      onOk: this.logout
    });
  }
  

  render() {
    const { show, login_flag, login_success_flag } = this.state

    //this logic is to render the input box message 
    // base on whether user username/password is correct
    var help_str = undefined
    var error = "success"
    if(login_success_flag == false){
      help_str = "Please input correct username and password!"
      error = "error"
    }

    const not_login_component = [
      <div key="user_login">
        <Button onClick={this.show_login_modal}> Login </Button>
        <Modal
          visible={show}
          onCancel={this.close_login_modal}
          width={1000}
          footer={null}
        >
          <div className={styles.modal}>
            <Row>
              <Col span={12}>
                <div className={styles.left_text_display}>
                  <h2> Join the Chef Copilot </h2>
                  <h3> Plan Your Healthy Day! </h3>
                  <Divider />
                  <Button 
                    className={styles.register_button}
                  >Register Now!</Button>
                </div>
              </Col>

              <Col span={12}>
                <Form
                  name="basic"
                  initialValues={{ remember: true }}
                  onFinish={this.user_login}
                >
                  <Form.Item
                    label="Username"
                    name="username"
                    validateStatus={error}
                    help={help_str}
                    rules={[{ required: true, message: 'Please input your username!' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    validateStatus={error}
                    help={help_str}
                    rules={[{ required: true, message: 'Please input your password!' }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item>
                    <Button className={styles.login_button} type="primary" htmlType="submit">
                      Sign In
                    </Button>
                  </Form.Item>
                </Form>

              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    ]

    // also use username to render it
    const username = localStorage.getItem('username') || ' '
    const login_component = [
      <div>
        <Button onClick={this.warning} className={styles.input_box}> Logout </Button>
        <Button type="primary" shape="circle">
          {username[0]}
        </Button>
      </div>
    ]

    // get the username from local storage
    // if username is undefine then give login button
    var component_on_render = login_component
    if(login_flag == false){
      component_on_render = not_login_component
    }

    return(
      <div>
        {component_on_render}
      </div>
    )
  }
}


export default UserLogin;
