import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const Students = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [groups, setGroups] = useState(["A", "B", "C"]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, selectedGroup, searchTerm]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/students");
      console.log("Fetched students:", response.data);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error("Failed to fetch students");
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (selectedGroup) {
      filtered = filtered.filter((student) => student.group === selectedGroup);
    }

    if (searchTerm) {
      filtered = filtered.filter((student) =>
        [student.firstName, student.lastName]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
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
      title: "Group",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editStudent(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => deleteStudent(record.id)}
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
    setEditingStudent(isEditing ? editingStudent : null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStudent(null);
  };

  const onFinish = (values) => {
    if (editingStudent) {
      setStudents(
        students.map((student) =>
          student.id === editingStudent.id ? { ...student, ...values } : student
        )
      );
      message.success("Student updated successfully");
    } else {
      const newStudent = { id: Date.now(), ...values };
      setStudents([...students, newStudent]);
      message.success("Student added successfully");
    }
    setIsModalVisible(false);
    setEditingStudent(null);
  };

  const editStudent = (student) => {
    setEditingStudent(student);
    showModal(true);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
    message.success("Student deleted successfully");
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Students</h1>
      <Button type="primary" onClick={() => showModal(false)}>
        Add Student
      </Button>
      <Button
        danger
        type="primary"
        icon={<LogoutOutlined />}
        onClick={onLogout}
        style={{ marginLeft: 1060 }}
      >
        Logout
      </Button>
      <div style={{ margin: "16px 0" }}>
        <Select
          placeholder="Select a group to filter"
          style={{ width: 200, marginRight: 16 }}
          onChange={(value) => setSelectedGroup(value)}
          allowClear
        >
          {groups.map((group) => (
            <Option key={group} value={group}>
              {group}
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
        dataSource={filteredStudents}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingStudent}
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
            name="group"
            label="Group"
            rules={[{ required: true, message: "Please select the group" }]}
          >
            <Select placeholder="Select a group">
              {groups.map((group) => (
                <Option key={group} value={group}>
                  {group}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingStudent ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;
