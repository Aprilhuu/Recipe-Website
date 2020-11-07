import React, {PureComponent } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Space, Row, 
        Col, Divider, Form, Checkbox, Radio } from 'antd';
import { Link } from 'umi';
import styles from './login.less'
import { withRouter } from "react-router-dom";

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
    this.switch_bw_login_register = this.switch_bw_login_register.bind(this)

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
      'login_form': true,
    };
  }

  user_login(values){
    const {username, password, login_form} = values

    // add here is the register flag is on
    // endpoint become register
    var path = 'v1/users/login'
    if(login_form == false){
      path = 'v1/users/register'
    }

    // send to backend
    axios.post(api_endpoint+path, {
      'username': username,
      'password': password,
    },{})
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
      // force to reload page
      window.location.reload();
    }).catch(error => {
      // raise login flag
      this.setState({
        'login_success_flag':false,
      })
    });
  }

  // remove the username in local storage
  logout(){
    // get the username
    const username = localStorage.getItem('username')
    // send to backend
    axios.post(api_endpoint+'v1/users/logout', {},
    {
      headers: {"Authorization":username}
    })
    // to use the arrow function let the this within the function scope
    .then(response => {
      localStorage.removeItem('username')

      // set down the flag
      this.setState({
        'login_flag':false,
      })

      // redirect to home
      this.props.history.push("/");
      window.location.reload();

    }).catch(error => {
      console.log(error)
    });
  }

  switch_bw_login_register(){
    const { login_form } = this.state
    this.setState({
      'login_form':!login_form
    })
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
    const { show, login_flag, login_success_flag, login_form } = this.state

    //this logic is to render the input box message 
    // base on whether user username/password is correct
    var help_str = undefined
    var error = "success"
    if(login_success_flag == false){
      help_str = "Please input correct username and password!"
      error = "error"
    }

    // switch between login and register
    var sign_or_register = (
      <Button className={styles.login_button} type="primary" htmlType="submit">
        Sign In
      </Button>
    )
    // also the register button will switch to the login
    var reg_log_switch_button = (
      <Button 
        className={styles.register_button}
        onClick={this.switch_bw_login_register}
      >Register Now!</Button>
    )
    if(login_form == false){
      sign_or_register = (
        <Button className={styles.login_button} type="primary" htmlType="submit">
          Register
        </Button>
      )

      reg_log_switch_button = (
        <Button 
          className={styles.register_button}
          onClick={this.switch_bw_login_register}
        >Already has account?</Button>
      )
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
                  {reg_log_switch_button}
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
                    {sign_or_register}
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


export default withRouter(UserLogin);
