import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

const loginContainerStyle = {
  maxWidth: 300,
  margin: "100px auto",
  zIndex: 2000, 
  position: "relative", 
};

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (values.username === "admin" && values.password === "password") {
        onLogin();
        navigate("/students");
        message.success("Login successful");
      } else {
        message.error("Invalid username or password");
      }
    }, 1000);
  };

  return (
    <div style={loginContainerStyle}>
      <h2 style={{ paddingBottom: "24px" }}>Login</h2>
      <Form onFinish={handleLogin}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
