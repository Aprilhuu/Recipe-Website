import React, {PureComponent } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Row,
        Col, Divider, Form, Menu, Dropdown } from 'antd';
import styles from './login.less'
import { withRouter } from "react-router-dom";

import defaultSettings from '../../../config/defaultSettings';
const {api_endpoint} = defaultSettings


/**********************************************
 * the compoennet is to handle the user login *
 * and the user regiter logic in the frontend *
 * perspective                                *
 **********************************************/
class UserLogin extends PureComponent {
  constructor(props) {
    super(props);

    // hook the function with class state
    this.user_login = this.user_login.bind(this)
    this.logout = this.logout.bind(this)
    this.show_login_modal = this.show_login_modal.bind(this)
    this.show_login_modal_homepage = this.show_login_modal_homepage.bind(this)
    this.close_login_modal = this.close_login_modal.bind(this)
    this.warning = this.warning.bind(this)
    this.switch_bw_login_register = this.switch_bw_login_register.bind(this)
    this.user_register = this.user_register.bind(this)
    this.user_login_register = this.user_login_register.bind(this)

    this.homepage = props.homepage;

    // check if the previous user had login infomation
    const username = localStorage.getItem('username')
    var login_flag = true
    if(username == undefined){
      login_flag = false
    }

    this.state = {
      'show':false,
      'login_flag': login_flag,
      'login_form': true,
      // error messge for the modal
      'help_str': undefined,
    };
  }


  /**
   * function dispatch the logic to login function
   * or the register fucntion based on the login_stateus
   *
   * @param values is the dictionary from the submitted form
   */
  user_login_register(values){
    const { login_form } = this.state

    if(login_form == false){
      this.user_register(values)
    }
    else{
      this.user_login(values)
    }
  }

  /**
   * function will handle the user login and pop the 
   * error message if user input is wrong
   * 
   * @param values is the dictionary from the submitted form
   */
  user_login(values){
    const { username, password } = values
    const { login_form } = this.state
    // login path
    var path = 'v1/users/login'

    // send to backend
    axios.post(api_endpoint+path, {
      'username': username,
      'password': password,
    },{})
    // to use the arrow function let the this within the function scope
    .then(response => {

      // if success then set the username into the local storage
      localStorage.setItem('username', response['data']['result']['username']);
      localStorage.setItem('logined_user', username);

      // raise login flag
      this.setState({
        'login_flag':true,
        'show':false,
      })
      // force to reload page
      window.location.reload();
    }).catch(error => {
      console.log(error.response)
      // show the login error message
      var error_message = 'please input correct username and password!'
      this.setState({
        'help_str':error_message,
      })
    });
  }


  /**
   * function will handle the user register to tell backend
   * to insert a new user record. if the username is duplicate
   * pop the error
   * 
   * @param values is the dictionary from the submitted form
   */
  user_register(values){
    const { username, password } = values
    const { login_form } = this.state
    // endpoint become register
    var path = 'v1/users/register'

    // send to backend
    axios.post(api_endpoint+path, {
      'username': username,
      'password': password,
    },{})
    // to use the arrow function let the this within the function scope
    .then(response => {

      // then login
      this.user_login(values)
    }).catch(error => {
      console.log(error.response)
      // pop up the register error
      var error_message = 'user already exist! please try another one'

      this.setState({
        'help_str':error_message,
      })
    });
  }


  /**
   * function will remove the username in local storage
   * and redirect to the home page
   */
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
      this.props.history.push("/copilot");
      window.location.reload();

    }).catch(error => {
      console.log(error)
    });
  }

  // switch the flag when user hit register now button
  switch_bw_login_register(){
    const { login_form } = this.state
    this.setState({
      'login_form':!login_form,
      'help_str': undefined,
    })
  }

  // opent the login modal
  show_login_modal(){
    this.setState({
      'show':true,
      // reset to login state every time
      'login_form': true,
    })
  }

  // opent the login modal from homepage
  show_login_modal_homepage(){
    this.setState({
      'show':true,
      // reset to login state every time
      'login_form': false,
    })
  }

  // close login modal
  close_login_modal(){
    this.setState({
      'show':false,
    })
  }

  // let user to confirm before logout
  warning() {
    Modal.confirm({
      title: 'Confirm to Logout',
      content: 'Are you sure to logout?',
      onOk: this.logout,
    });
  }


  render() {
    const { show, login_flag, help_str, login_form } = this.state

    //this logic is to render the input box message
    // base on whether user username/password is correct
    var error = "success"
    if(help_str !== undefined){
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
    if(login_form === false){
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

    let loginModal = (
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
                onFinish={this.user_login_register}
              >
                <Form.Item
                  label="Username"
                  name="username"
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
                {sign_or_register}
                <Form.Item>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </Modal>
    )

    let not_login_component;
    if (!this.homepage){
      not_login_component = [
        <div key="user_login">
          <Button onClick={this.show_login_modal}> Login </Button>
          {loginModal}
        </div>
      ]
    }
    else{
      not_login_component = [
        <div className={styles.user_login_homepage} key="user_login_2">
          <h1 style={{fontWeight: "bold"}}> Sign in to explore full features of Chef Co-Pilot!</h1>
          <h3 style={{color: "GrayText", marginBottom: "25px"}}> This will give you access to amazing features like meal planner and shopping list 🔥 </h3>
          {loginModal}
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.user_login_register}
          >
            <Form.Item
              label="Username"
              name="username"
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
            <Divider />
            <h4> Not a user? <Button type="link" onClick={this.show_login_modal_homepage} >Sign up now!</Button> </h4>
          </Form>
        </div>
      ]
    }


    // if user logined then he will see logout and user icon
    // also use username to render it
    const username = localStorage.getItem('logined_user') || ' '
    const dropdown_menu = (
      <Menu>
        <Menu.Item>
          <Button key='logout_button' onClick={this.warning} className={styles.input_box}> Logout </Button>
        </Menu.Item>
      </Menu>
    );

    let login_component;
    if (!this.homepage){
      login_component = [
        <Dropdown overlay={dropdown_menu} placement="bottomCenter">
          <Button key='user_icon' type="primary" shape="circle">
            {username[0]}
          </Button>
        </Dropdown>
      ]
    } else{
      login_component = []
    }

    // get the username from local storage
    // if username is undefine then give login button
    // else show the logout and user icon
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
