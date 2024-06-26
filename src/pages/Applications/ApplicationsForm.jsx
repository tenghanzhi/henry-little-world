import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Form, Input, Select, Popconfirm, Tooltip } from "antd";
import {
  RollbackOutlined,
  DeleteOutlined,
  CheckOutlined,
  FormatPainterOutlined,
  CopyOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import apiMatrix from "../common/apiMatrix";
import messageMatrix from "../common/messageMatrix";
import categoryMatrix from "../common/categoryMatrix";
import validateMessages from "../common/validateMessages";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import handleMessage from "../utils/handleMessage";
import style from "./style/ApplicationsForm.module.css";

const ApplicationsForm = (props) => {
  const pageType = props.isEdit && props.isEdit !== "" ? "edit" : "create";
  const defaultData = props.data && props.data !== {} ? props.data : {};
  const userInfoData = useSelector((state) => state.userInfoData);
  const selectedApplicationId = useSelector(
    (state) => state.selectedApplicationId
  );
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filedValue, setFiledValue] = useState(form.getFieldValue());
  const [codeOne, setCodeOne] = useState(
    pageType === "edit" ? defaultData?.codeOne?.toString() : ""
  );
  const [codeTwo, setCodeTwo] = useState(
    pageType === "edit" ? defaultData?.codeTwo?.toString() : ""
  );
  const [codeThree, setCodeThree] = useState(
    pageType === "edit" ? defaultData?.codeThree?.toString() : ""
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleGoback = () => {
    navigate(-1);
  };

  const handleFormValueChange = (type, value) => {
    switch (type) {
      case (type = "setCodeOne"):
        setCodeOne(value);
        setFiledValue(form.getFieldValue());
        break;
      case (type = "setCodeTwo"):
        setCodeTwo(value);
        setFiledValue(form.getFieldValue());
        break;
      case (type = "setCodeThree"):
        setCodeThree(value);
        setFiledValue(form.getFieldValue());
        break;
      default:
        setFiledValue(form.getFieldValue());
        break;
    }
  };

  const handleFormatCode = (type) => {
    const beautify_js = require("js-beautify");

    switch (type) {
      case "codeOne":
        setCodeOne(beautify_js(codeOne, { indent_size: 4 }));
        break;
      case "codeTwo":
        setCodeTwo(beautify_js(codeTwo, { indent_size: 4 }));
        break;
      case "codeThree":
        setCodeThree(beautify_js(codeThree, { indent_size: 4 }));
        break;
      default:
        break;
    }

    setFiledValue(form.getFieldValue());
  };

  const handlePasteCode = async (type) => {
    const clipboard = await navigator.clipboard.readText();

    switch (type) {
      case "codeOne":
        setCodeOne(clipboard);
        break;
      case "codeTwo":
        setCodeTwo(clipboard);
        break;
      case "codeThree":
        setCodeThree(clipboard);
        break;
      default:
        break;
    }
  };

  const handleClearCode = (type) => {
    switch (type) {
      case "codeOne":
        setCodeOne("");
        break;
      case "codeTwo":
        setCodeTwo("");
        break;
      case "codeThree":
        setCodeThree("");
        break;
      default:
        break;
    }
  };

  const handleResetCode = (type) => {
    switch (type) {
      case "codeOne":
        setCodeOne(defaultData?.codeOne?.toString());
        break;
      case "codeTwo":
        setCodeTwo(defaultData?.codeTwo?.toString());
        break;
      case "codeThree":
        setCodeThree(defaultData?.codeThree?.toString());
        break;
      default:
        break;
    }
  };

  const handleSubmit = (type, values) => {
    const messageKey = "uploadingDataMessage";
    const messageAction = handleGoback;
    handleMessage(
      messageKey,
      "loading",
      messageMatrix.UPLOAD_UPDATED_DATA_MESSAGE_LOADING
    );

    values.data.codeOne = codeOne?.toString();
    values.data.codeTwo = codeTwo?.toString();
    values.data.codeThree = codeThree?.toString();

    if (type.toLowerCase() === "create") {
      (async () => {
        const response = await fetch(apiMatrix.APPLICATIONS_CREATE_NEW, {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfoData.jwt}`,
          },
        });
        return response.json();
      })()
        .then((response) => {
          if (response && response.error) {
            throw new Error(response.error.message);
          } else {
            handleMessage(
              messageKey,
              "success",
              messageMatrix.UPLOAD_UPDATED_DATA_MESSAGE_SUCCESS,
              messageAction
            );
          }
        })
        .catch((error) => {
          handleMessage(
            messageKey,
            "error",
            `${messageMatrix.LOADING_MESSAGE_ERROR}${error}`
          );
          setIsUploading(false);
        });
    } else if (type.toLowerCase() === "edit") {
      (async () => {
        const response = await fetch(
          `${apiMatrix.APPLICATIONS_UPDATE_BY_ID}/${selectedApplicationId}`,
          {
            method: "PUT",
            mode: "cors",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfoData.jwt}`,
            },
          }
        );
        return response.json();
      })()
        .then((response) => {
          if (response && response.error) {
            throw new Error(response.error.message);
          } else {
            handleMessage(
              messageKey,
              "success",
              messageMatrix.UPDATING_MESSAGE_SUCCESS,
              messageAction
            );
          }
        })
        .catch((error) => {
          handleMessage(
            messageKey,
            "error",
            `${messageMatrix.LOADING_MESSAGE_ERROR}${error}`
          );
          setIsUploading(false);
        });
    }
  };

  const handleDelete = () => {
    const messageKey = "deleteDataMessage";
    const messageAction = navigate(
      `/${categoryMatrix.APPLICATIONS.toLowerCase()}`
    );
    handleMessage(
      messageKey,
      "loading",
      messageMatrix.DELETING_MESSAGE_LOADING
    );
    setIsUploading(true);

    (async () => {
      const response = await fetch(
        `${apiMatrix.APPLICATIONS_DELETE_BY_ID}/${selectedApplicationId}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfoData.jwt}`,
          },
        }
      );
      return response.json();
    })()
      .then((response) => {
        if (response && response.error) {
          throw new Error(response.error.message);
        } else {
          handleMessage(
            messageKey,
            "success",
            messageMatrix.DELETING_MESSAGE_SUCCESS,
            messageAction
          );
        }
      })
      .catch((error) => {
        handleMessage(
          messageKey,
          "error",
          `${messageMatrix.LOADING_MESSAGE_ERROR}${error}`
        );
        setIsUploading(false);
      });
  };

  const onFinish = (values) => {
    setIsUploading(true);
    handleSubmit(pageType, values);
  };

  const handleDisableSubmitBtn = () => {
    let isHasError = false;

    if (!!form.getFieldsError().filter(({ errors }) => errors.length).length) {
      isHasError = true;
    } else isHasError = false;

    const isAllRequiredFiled =
      filedValue.data !== {} &&
      filedValue.data?.hasOwnProperty("name") &&
      filedValue.data?.hasOwnProperty("type");

    return isHasError || !isAllRequiredFiled;
  };

  const formLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const formProps = {
    allowClear: true,
    onChange: handleFormValueChange,
  };

  const typeOptions = [
    {
      label: "Array",
      value: "Array",
    },
    {
      label: "BOM",
      value: "BOM",
    },
    {
      label: "DEV",
      value: "DEV",
    },
    {
      label: "DOM",
      value: "DOM",
    },
    {
      label: "Git",
      value: "Git",
    },
    {
      label: "H5C3",
      value: "H5C3",
    },
    {
      label: "Object",
      value: "Object",
    },
    {
      label: "String",
      value: "String",
    },
    {
      label: "Test",
      value: "Test",
    },
    {
      label: "Utils",
      value: "Utils",
    },
  ];

  return (
    <Form
      {...formLayout}
      className={style.lw_applications_wrapper}
      name="application"
      form={form}
      onFinish={onFinish}
      validateMessages={validateMessages}
      initialValues={
        pageType === "edit"
          ? {
              data: {
                name: defaultData.name,
                type: defaultData.type,
                source: defaultData.source,
                description: defaultData.description,
              },
            }
          : {}
      }
    >
      <Form.Item
        name={["data", "name"]}
        label="Application Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input {...formProps} placeholder="Input Application Name" />
      </Form.Item>
      <Form.Item
        name={["data", "type"]}
        label="Type"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          {...formProps}
          placeholder="Select a Type"
          showSearch
          options={typeOptions.sort((a, b) =>
            a.value > b.value ? 1 : b.value > a.value ? -1 : 0
          )}
        />
      </Form.Item>
      <Form.Item name={["data", "source"]} label="Source">
        <Input {...formProps} placeholder="Input Application Source" />
      </Form.Item>
      <Form.Item name={["data", "description"]} label="Description">
        <Input.TextArea
          {...formProps}
          placeholder="Input Description"
          rows={8}
        />
      </Form.Item>
      <Form.Item name={["data", "codeOne"]} label="Code One">
        <div>
          <Tooltip title="Format Codes">
            <Button
              className={style.lw_applications_form_btns}
              onClick={() => handleFormatCode("codeOne")}
              icon={<FormatPainterOutlined />}
            />
          </Tooltip>
          <Tooltip title="Paste from Clipboard">
            <Button
              className={style.lw_applications_form_btns}
              onClick={() => handlePasteCode("codeOne")}
              icon={<CopyOutlined />}
            />
          </Tooltip>
          <Tooltip title="Clear Code Area">
            <Button
              className={style.lw_applications_form_btns}
              onClick={() => handleClearCode("codeOne")}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
          {pageType === "edit" && (
            <Tooltip title="Reset">
              <Button
                className={style.lw_applications_form_btns}
                onClick={() => handleResetCode("codeOne")}
                icon={<RedoOutlined />}
              />
            </Tooltip>
          )}
          <CodeMirror
            {...formProps}
            height="600px"
            extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
            value={codeOne}
            onChange={(e) => handleFormValueChange("setCodeOne", e)}
            theme={vscodeDark}
          />
        </div>
      </Form.Item>
      <Form.Item name={["data", "codeTwo"]} label="Code Two">
        <div>
          <Tooltip title="Format Codes">
            <Button
              className={style.lw_applications_form_btns}
              onClick={() => handleFormatCode("codeTwo")}
              icon={<FormatPainterOutlined />}
            />
          </Tooltip>
          <Tooltip title="Paste from Clipboard">
            <Button
              className={style.lw_applications_form_btns}
              onClick={() => handlePasteCode("codeTwo")}
              icon={<CopyOutlined />}
            />
          </Tooltip>
          <Tooltip title="Clear Code Area">
            <Button
              className={style.lw_applications_form_btns}
              onClick={() => handleClearCode("codeTwo")}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
          {pageType === "edit" && (
            <Tooltip title="Reset">
              <Button
                className={style.lw_applications_form_btns}
                onClick={() => handleResetCode("codeTwo")}
                icon={<RedoOutlined />}
              />
            </Tooltip>
          )}
          <CodeMirror
            {...formProps}
            height="600px"
            extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
            value={codeTwo}
            onChange={(e) => handleFormValueChange("codeTwo", e)}
            theme={vscodeDark}
          />
        </div>
      </Form.Item>
      <Form.Item name={["data", "codeThree"]} label="Code Three">
        <div className={style.lw_applications_form_codemirror_wrapper}>
          <Tooltip title="Format Codes">
            <Button
              className={style.lw_applications_form_btns}
              onClick={() => handleFormatCode("codeThree")}
              icon={<FormatPainterOutlined />}
            />
          </Tooltip>
          <Tooltip title="Paste from Clipboard">
            <Button
              className={style.lw_applications_form_btns}
              onClick={() => handlePasteCode("codeThree")}
              icon={<CopyOutlined />}
            />
          </Tooltip>
          <Tooltip title="Clear Code Area">
            <Button
              className={style.lw_applications_form_btns}
              onClick={() => handleClearCode("codeThree")}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
          {pageType === "edit" && (
            <Tooltip title="Reset">
              <Button
                className={style.lw_applications_form_btns}
                onClick={() => handleResetCode("codeThree")}
                icon={<RedoOutlined />}
              />
            </Tooltip>
          )}
          <CodeMirror
            {...formProps}
            height="600px"
            extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
            value={codeThree}
            onChange={(e) => handleFormValueChange("setCodeThree", e)}
            theme={vscodeDark}
          />
        </div>
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <div className={style.lw_applications_form_btns_wrapper}>
            <Button
              className={style.lw_applications_form_btns}
              type="default"
              onClick={handleGoback}
              icon={<RollbackOutlined />}
            >
              Cancel
            </Button>
            {pageType === "edit" && userInfoData.jwt && (
              <Popconfirm
                title={`Confirm to delete ${defaultData.name}`}
                className={style.lw_applications_form_btns}
                placement="top"
                onConfirm={handleDelete}
                okText="Confirm"
                cancelText="Cancel"
              >
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={isUploading}
                >
                  Delete
                </Button>
              </Popconfirm>
            )}
            <Button
              className={style.lw_applications_form_btns}
              type="primary"
              htmlType="submit"
              disabled={handleDisableSubmitBtn() || isUploading}
              icon={<CheckOutlined />}
            >
              Submit
            </Button>
          </div>
        )}
      </Form.Item>
    </Form>
  );
};

export default ApplicationsForm;
