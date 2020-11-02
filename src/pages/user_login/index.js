import React, {PureComponent } from 'react';
import axios from 'axios';
import { Modal, Button, Input, Space } from 'antd';
import { Link } from 'umi';

import defaultSettings from '../../../config/defaultSettings';
const {api_endpoint} = defaultSettings



class UserLogin extends PureComponent {
  constructor(props) {
    super(props);

    this.user_login = this.user_login.bind(this)
    this.logout = this.logout.bind(this)
    this.show_login_modal = this.show_login_modal.bind(this)
    this.close_login_modal = this.close_login_modal.bind(this)
    this.username_update = this.username_update.bind(this)
    this.password_update = this.password_update.bind(this)

    const username = localStorage.getItem('username')
    var login_flag = true
    if(username == undefined){
      login_flag = false
    }

    this.state = {
      'show':false,
      'username': username,
      'password': undefined,
      'login_flag': login_flag,
    };
  }

  // after the component is rendered
  componentDidMount(){
    
  }

  user_login(){
    const {username, password} = this.state

    // send to backend
    axios.post(api_endpoint+'/v1/users/login', {
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
    }).catch(function (error) {
      console.log(error);
    });


    // raise login flag
    this.setState({
      'show':false,
    })
  }

  // remove the username in local storage
  logout(){
    localStorage.removeItem('username')
    // set down the flag
    this.setState({
      'login_flag':false,
    })
  }

  username_update(e){
    this.setState({
      'username':e.target.value,
    })
  }

  password_update(e){
    this.setState({
      'password':e.target.value,
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
  

  render() {
    const { show, login_flag } = this.state

    const not_login_component = [
      <div>
        <Button onClick={this.show_login_modal}> Login </Button>
        <Modal
          title="User Login"
          visible={show}
          onOk={this.user_login}
          onCancel={this.close_login_modal}
        >
          <Input
            placeholder="username"
            onChange={this.username_update}
          />
          <Input.Password
            placeholder="password"
            onChange={this.password_update}
          />
        </Modal>
      </div>
    ]

    const login_component = [
      <div>
        <Button onClick={this.logout}> Logout </Button>
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
