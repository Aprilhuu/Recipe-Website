import { PureComponent } from 'react';
import { Layout, Menu, Breadcrumb, Anchor, Button, Row, Col } from 'antd';
import { Link } from 'umi';
import UserLogin from '../pages/user_login/index.js'
import home from '../assets/images/home.png'

const { Header, Content, Footer } = Layout;



class Header_bar extends PureComponent {
  constructor(props){
    super(props);
  }

  render(){
    const username = localStorage.getItem('username')
    // console.log(username)
    var headers = [
      (<Menu.Item key="0">
          <Link to='/copilot'><img width="30" src={home}></img></Link>
        </Menu.Item>),
      (<Menu.Item key="1">
          <Link to='/recipe-list'>Recipe List</Link>
        </Menu.Item>),
      (<Menu.Item key="2">
        <Link to='/search-page'>Search Recipe</Link>
      </Menu.Item>)
    ]
    if(username != null){
      headers.push(
        <Menu.Item key="4">
          <Link to='/meal-planner'>Meal Planner</Link>
        </Menu.Item>)

      headers.push(
        <Menu.Item key="5">
          <Link to='/shopping-list'>Shopping List</Link>
        </Menu.Item>)
    }

    return(
      <Header>
        <Row>
          <Col span={1}>
            <div className="logo" />
          </Col>
          <Col span={21}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys="0">
              {headers}
            </Menu>
          </Col>
          <Col span={2}>
            <UserLogin/>
          </Col>
        </Row>
      </Header>
    )
  }
}


const BasicLayout = ({ children }) => (


  <Layout className="layout">
    <Header_bar />
    <Content style={{ padding: '0 50px' }}>
      <br></br>
      <br></br>
      <div className="site-layout-content">{children}</div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Chef Co-Pilot ©2020 by Quaranteam</Footer>
  </Layout>
);

export default BasicLayout;
