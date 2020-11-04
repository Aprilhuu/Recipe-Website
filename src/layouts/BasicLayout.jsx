import { Layout, Menu, Breadcrumb, Anchor } from 'antd';
import { Link } from 'umi';
import home from '../assets/images/home.png'

const { Header, Content, Footer } = Layout;


const BasicLayout = ({ children }) => (


  <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys="0">
        <Menu.Item key="0">
        <Link to='/'><img width="30" src={home}></img></Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to='/recipe-list'>Recipe List</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to='/meal-planner'>Meal Planner</Link>
        </Menu.Item>
        <Menu.Item key="3">Search Recipe</Menu.Item>
        <Menu.Item key="4">
          <Link to='/shopping-list'>Shopping List</Link>
        </Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <br></br>
      <br></br>
      <div className="site-layout-content">{children}</div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Chef Co-Pilot ©2020 by Quaranteam</Footer>
  </Layout>
);

export default BasicLayout;
