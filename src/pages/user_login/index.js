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
    this.show_login_modal = this.show_login_modal.bind(this)
    this.close_login_modal = this.close_login_modal.bind(this)
    this.username_update = this.username_update.bind(this)
    this.password_update = this.password_update.bind(this)

    this.state = {
      'show':false,
      'username': undefined,
      'password': undefined,
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
    })
    .then(function (response) {
      console.log(response);

      // if success then set the username into the local storage
      localStorage.setItem('username', username);
    }).catch(function (error) {
      console.log(error);
    });
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
    const { show } = this.state

    return(
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
    )
  }
}


export default UserLogin;
