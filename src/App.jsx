// App.js

import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import { Layout, Menu } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import Students from "./components/Students";
import Teachers from "./components/Teachers";
import Login from "./components/Login";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/students">Students</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<TeamOutlined />}>
              <Link to="/teachers">Teachers</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Routes>
                <Route
                  path="/login"
                  element={<Login onLogin={handleLogin} />}
                />
                <Route
                  path="/students"
                  element={
                    isAuthenticated ? (
                      <Students onLogout={handleLogout} />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/teachers"
                  element={
                    isAuthenticated ? <Teachers /> : <Navigate to="/login" />
                  }
                />
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
