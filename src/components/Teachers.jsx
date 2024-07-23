import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const Teachers = ({ onLogout }) => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [levels, setLevels] = useState(["Junior", "Middle", "Senior"]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, selectedLevel, searchTerm]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/teachers");
      console.log("Fetched teachers:", response.data);
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      message.error("Failed to fetch teachers");
    }
  };

  const filterTeachers = () => {
    let filtered = teachers;

    if (selectedLevel) {
      filtered = filtered.filter((teacher) => teacher.level === selectedLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter((teacher) =>
        [teacher.firstName, teacher.lastName]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTeachers(filtered);
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastname",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editTeacher(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => deleteTeacher(record.id)}
            danger
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const showModal = (isEditing = false) => {
    if (!isEditing) {
      form.resetFields();
    }
    setEditingTeacher(isEditing ? editingTeacher : null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTeacher(null);
  };

  const onFinish = (values) => {
    if (editingTeacher) {
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === editingTeacher.id ? { ...teacher, ...values } : teacher
        )
      );
      message.success("Teacher updated successfully");
    } else {
      const newTeacher = { id: Date.now(), ...values };
      setTeachers([...teachers, newTeacher]);
      message.success("Teacher added successfully");
    }
    setIsModalVisible(false);
    setEditingTeacher(null);
  };

  const editTeacher = (teacher) => {
    setEditingTeacher(teacher);
    showModal(true);
  };

  const deleteTeacher = (id) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
    message.success("Teacher deleted successfully");
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Teachers</h1>
      <Button type="primary" onClick={() => showModal(false)}>
        Add Teacher
      </Button>
      <Button
        danger
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{ marginLeft: 1060 }}
      >
        Logout
      </Button>
      <div style={{ margin: "16px 0" }}>
        <Select
          placeholder="Select a level to filter"
          style={{ width: 200, marginRight: 16 }}
          onChange={(value) => setSelectedLevel(value)}
          allowClear
        >
          {levels.map((level) => (
            <Option key={level} value={level}>
              {level}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="Search by first or last name"
          style={{ width: 400 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredTeachers}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
      <Modal
        title={editingTeacher ? "Edit Teacher" : "Add Teacher"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingTeacher}
          onFinish={onFinish}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter the first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter the last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: "Please select the level" }]}
          >
            <Select placeholder="Select a level">
              {levels.map((level) => (
                <Option key={level} value={level}>
                  {level}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTeacher ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Teachers;
