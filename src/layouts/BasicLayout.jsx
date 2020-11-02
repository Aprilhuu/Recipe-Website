import { Layout, Menu, Breadcrumb, Anchor, Button, Row, Col } from 'antd';
import { Link } from 'umi';
import UserLogin from '../pages/user_login/index.js'


const { Header, Content, Footer } = Layout;


const BasicLayout = ({ children }) => (


  <Layout className="layout">
    <Header>
      <Row>
        <Col span={1}>
          <div className="logo" />
        </Col>
        <Col span={21}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to='/recipe-list'>Recipe List</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to='/meal-planner'>Meal Planner</Link>
            </Menu.Item>
            <Menu.Item key="3">Search Recipe</Menu.Item>
          </Menu>
        </Col>
        <Col span={2}>
          <UserLogin/>
        </Col>
      </Row>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-content">{children}</div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Chef Co-Pilot ©2020 by Quaranteam</Footer>
  </Layout>
);

export default BasicLayout;
