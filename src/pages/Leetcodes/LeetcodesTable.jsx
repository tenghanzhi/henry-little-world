import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Space,
  Table,
  Tag,
  Button,
  Tooltip,
  Popconfirm,
  Input,
  message,
} from "antd";
import {
  EditOutlined,
  CodeOutlined,
  EyeOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import moment from "moment/moment";
import convertStringToArrayByComma from "../utils/convertStringToArrayByComma";
import messageMatrix from "../common/messageMatrix";
import categoryMatrix from "../common/categoryMatrix";
import password from "../common/password";
import {
  SET_SELECTED_LEETCODE_ID,
  SET_LEETCOD_TABLE_PAGENATION,
  SET_LEETCOD_TABLE_SORTER,
  SET_LEETCOD_TABLE_FILTER,
} from "../../redux/constants";

const LeetCodesTable = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const leetcodeTablePagenation = useSelector(
    (state) => state.leetcodeTablePagenation
  );
  const leetcodeTableFilter = useSelector((state) => state.leetcodeTableFilter);
  const data = props.data.data ? props.data.data : null;
  const total = props?.data?.meta?.pagination?.total
    ? props?.data?.meta?.pagination?.total
    : 0;
  const [inputPassword, setInputPassword] = useState(null);

  const handleDifficultyTagColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy": {
        return "green";
      }
      case "medium": {
        return "geekblue";
      }
      case "hard": {
        return "volcano";
      }
      default: {
        return "black";
      }
    }
  };

  const handleTypeTagColor = (type) => {
    switch (type.toLowerCase()) {
      case "array": {
        return "magenta";
      }
      case "hash table": {
        return "red";
      }
      case "linked list": {
        return "volcano";
      }
      case "math": {
        return "orange";
      }
      case "recursion": {
        return "gold";
      }
      case "stack": {
        return "lime";
      }
      case "sorting": {
        return "green";
      }
      case "string": {
        return "cyan";
      }
      case "tree": {
        return "blue";
      }
      case "sliding window": {
        return "geekblue";
      }
      case "divide and conquer": {
        return "purple";
      }
      case "heap": {
        return "#2db7f5";
      }
      case "bucket sort": {
        return "#87d068";
      }
      case "counting": {
        return "#108ee9";
      }
      case "quickselect": {
        return "#BD2FCB";
      }
      default: {
        return "black";
      }
    }
  };

  const handleActionBtnOnClick = (type, record) => {
    switch (type.toLowerCase()) {
      case "check":
        window.open(record.attributes.link);
        break;
      case "review":
        dispatch({ type: SET_SELECTED_LEETCODE_ID, payload: record.id });
        navigate(`/${categoryMatrix.LEETCODES.toLowerCase()}/reviewLeetCodes`);
        break;
      default:
        return null;
    }
  };

  const handleMessage = (key, type, content) => {
    const messageDuration = 2;

    switch (type) {
      case "loading": {
        message.loading({
          key: key,
          content: messageMatrix.LOADING_MESSAGE_LOADING,
        });
        break;
      }
      case "success": {
        message.success({
          key: key,
          content: messageMatrix.LOADING_MESSAGE_SUCCESS,
          duration: messageDuration,
        });
        break;
      }
      case "error": {
        message.error({
          key: key,
          content: `${messageMatrix.LOADING_MESSAGE_ERROR}${content}`,
          duration: messageDuration,
        });
        break;
      }
      default:
        return null;
    }
  };

  const handlePasswordValueChange = (e) => {
    setInputPassword(e.target.value);
  };

  const handleConfirmPassword = (id) => {
    if (inputPassword !== null && inputPassword === password) {
      handleMessage("passwordResult", "success");
      dispatch({ type: SET_SELECTED_LEETCODE_ID, payload: id });
      navigate(`/${categoryMatrix.LEETCODES.toLowerCase()}/editLeetCodes`);
    } else {
      handleMessage("passwordResult", "error");
      setInputPassword(null);
    }
  };

  const handleCancelPassword = () => {
    setInputPassword(null);
  };

  const handlePaginationChange = (current, size) => {
    dispatch({
      type: SET_LEETCOD_TABLE_PAGENATION,
      payload: { current: current, size: size },
    });
  };

  const handleTableChange = (filter, sorter) => {
    let order;
    if (sorter?.order === "ascend") order = ":asc";
    else if (sorter?.order === "descend") order = ":desc";
    else order = null;
    dispatch({
      type: SET_LEETCOD_TABLE_SORTER,
      payload: { sort: sorter.field, order: order },
    });

    dispatch({
      type: SET_LEETCOD_TABLE_FILTER,
      payload: {
        difficulty:
          filter?.difficulty?.length > 0 ? filter?.difficulty[0] : null,
        type: filter?.type?.length > 0 ? filter?.type[0] : null,
        leetcodeIndex: leetcodeTableFilter.leetcodeIndex,
        title: leetcodeTableFilter.title,
      },
    });
  };

  const difficultyFilterOptions = [
    {
      text: "Easy",
      value: "easy",
    },
    {
      text: "Medium",
      value: "medium",
    },
    {
      text: "Hard",
      value: "hard",
    },
  ];

  const typeFilterOptions = [
    {
      text: "Array",
      value: "array",
    },
    {
      text: "Hash Table",
      value: "hash table",
    },
    {
      text: "Linked List",
      value: "linked list",
    },
    {
      text: "Math",
      value: "math",
    },
    {
      text: "Recursion",
      value: "recursion",
    },
    {
      text: "Stack",
      value: "stack",
    },
    {
      text: "Sorting",
      value: "sorting",
    },
    {
      text: "String",
      value: "string",
    },
    {
      text: "Tree",
      value: "tree",
    },
    {
      text: "Sliding Window",
      value: "sliding window",
    },
    {
      text: "Divide and Conquer",
      value: "divide and conquer",
    },
    {
      text: "Heap",
      value: "heap",
    },
    {
      text: "Bucket Sort",
      value: "bucket sort",
    },
    {
      text: "Counting",
      value: "counting",
    },
    {
      text: "Quickselect",
      value: "quickselect",
    },
  ];

  const columns = [
    {
      title: "Index",
      key: "leetcodeIndex",
      dataIndex: "leetcodeIndex",
      defaultSortOrder: "ascend",
      render: (_, record) => {
        return (
          <Tooltip title="Check on LeetCode">
            <Button
              type="link"
              onClick={() => handleActionBtnOnClick("check", record)}
            >
              {record.attributes.leetcodeIndex}
            </Button>
          </Tooltip>
        );
      },
      sorter: (a, b) =>
        a.attributes?.leetcodeIndex - b.attributes?.leetcodeIndex,
    },
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
      render: (_, record) => {
        return (
          <Tooltip title="Review on Little World">
            {/* eslint-disable-next-line */}
            <a onClick={() => handleActionBtnOnClick("review", record)}>
              {record.attributes.title}
            </a>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.attributes?.title?.localeCompare(b.attributes?.title),
    },
    {
      title: "Completed Date",
      key: "firstCompletedDate",
      dataIndex: "firstCompletedDate",
      render: (_, record) => <div>{record.attributes.firstCompletedDate}</div>,
      sorter: (a, b) =>
        moment(a.attributes.firstCompletedDate).unix() -
        moment(b.attributes.firstCompletedDate).unix(),
    },
    {
      title: "Difficulty",
      key: "difficulty",
      dataIndex: "difficulty",
      render: (_, record) => (
        <Tag
          color={handleDifficultyTagColor(record.attributes?.difficulty)}
          key={record.id}
        >
          {record.attributes?.difficulty?.toUpperCase()}
        </Tag>
      ),
      sorter: (a, b) =>
        a.attributes?.difficulty?.localeCompare(b.attributes?.difficulty),
      filters: difficultyFilterOptions,
      filterMultiple: false,
      onFilter: (value, record) =>
        record?.attributes?.difficulty?.toLowerCase().indexOf(value) === 0,
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
      render: (_, record) => (
        <>
          {convertStringToArrayByComma(record.attributes.type)
            .sort((a, b) => a.trim().localeCompare(b.trim()))
            .map((item) => (
              <Tag color={handleTypeTagColor(item.trim())} key={item.trim()}>
                {item.trim().toUpperCase()}
              </Tag>
            ))}
        </>
      ),
      filters: typeFilterOptions.sort((a, b) =>
        a.value > b.value ? 1 : b.value > a.value ? -1 : 0
      ),
      filterMultiple: false,
      onFilter: (value, record) => {
        return record?.attributes?.type
          ?.replace(/\s/g, "")
          .toLowerCase()
          .includes(value.replace(/\s/g, ""));
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      width: 150,
      render: (_, record) => (
        <Space wrap direction="horizantal">
          <Tooltip title="Check on LeetCode">
            <Button
              type="text"
              icon={<CodeOutlined />}
              onClick={() => handleActionBtnOnClick("check", record)}
            />
          </Tooltip>
          <Tooltip title="Review on Little World">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleActionBtnOnClick("review", record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Popconfirm
              title={"Please input password to edit."}
              placement="topRight"
              description={
                <>
                  <Input.Password
                    placeholder="Input password"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    onChange={(e) => handlePasswordValueChange(e)}
                    allowClear={true}
                    value={inputPassword}
                    onPressEnter={() => handleConfirmPassword(record.id)}
                  />
                </>
              }
              onConfirm={() => handleConfirmPassword(record.id)}
              onCancel={handleCancelPassword}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Button type="text" icon={<EditOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        defaultPageSize: leetcodeTablePagenation?.size
          ? leetcodeTablePagenation.size
          : 20,
        defaultCurrent: leetcodeTablePagenation?.current
          ? leetcodeTablePagenation.current
          : 1,
        total: total,
        onChange: (current, size) => handlePaginationChange(current, size),
      }}
      bordered
      onChange={(val, filter, sorter, extra) =>
        handleTableChange(filter, sorter)
      }
    />
  );
};

export default LeetCodesTable;
