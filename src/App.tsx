import './App.css';
import { Menu } from 'antd';
import { StockOutlined } from '@ant-design/icons';
import { Equities } from './comps/equities/Equities';
import Sider from 'antd/lib/layout/Sider';
import SubMenu from 'antd/lib/menu/SubMenu';
import { Typography } from 'antd';

const { Title } = Typography;

function App() {
  return (
    <div>
      <div className='sectionContainer'>
        <section className='menuSection'>
          <Title level={4} className={'groupTitle'}>ARC Capital</Title>
          <Sider className='menuContainer'>
            <Menu
              mode="inline"
              defaultSelectedKeys={['his']}
              defaultOpenKeys={['pri']}
              className={'menu'}
            >
              <SubMenu icon={<StockOutlined />} key="pri" title="Pricing">
                <Menu.Item key="his" defaultChecked>Historical</Menu.Item>
                <Menu.Item key="eod">Reports</Menu.Item>
                <Menu.Item key="pos">Positions</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
        </section>
        <section className='contentSection'>
          <Equities />
        </section>
      </div>
    </div>
  );
}

export default App;
