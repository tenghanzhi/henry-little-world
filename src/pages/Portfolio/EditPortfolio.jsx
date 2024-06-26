import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Skeleton, Typography, Button, Form, Input, DatePicker } from "antd";
import apiMatrix from "../common/apiMatrix";
import messageMatrix from "../common/messageMatrix";
import validateMessages from "../common/validateMessages";
import LwLayout from "../common/LwLayout";
import structuredClone from "@ungap/structured-clone";
import sortObjByKey from "../utils/sortObjByKey";
import dayjs from "dayjs";
import handleMessage from "../utils/handleMessage";
import style from "./style/EditPortfolio.module.css";

const EditPortfolio = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const selectedPortfolioId = useSelector((state) => state.selectedPortfolioId);
  const userInfoData = useSelector((state) => state.userInfoData);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [fetchedPortfolioData, setFetchedPortfolioData] = useState({});
  const [filedValue, setFiledValue] = useState(form.getFieldValue());

  useEffect(() => {
    const messageKey = "editPageLoadingMessage";

    (async () => {
      const response = await fetch(
        `${apiMatrix.PORTFOLIOS_GET_BY_ID}/${selectedPortfolioId}`
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
            messageMatrix.LOADING_MESSAGE_SUCCESS
          );
        }
        setFetchedPortfolioData(response.data.attributes);
      })
      .catch((error) => {
        handleMessage(
          messageKey,
          "error",
          `${messageMatrix.LOADING_MESSAGE_ERROR}${error}`
        );
      })
      .finally(() => {
        setIsPageLoading(false);
      });
  }, [selectedPortfolioId]);

  const handleGoback = () => {
    navigate(-1);
  };

  const handleUpdate = (values) => {
    const messageKey = "uploadingDataMessage";
    const messageAction = handleGoback;
    handleMessage(
      messageKey,
      "loading",
      messageMatrix.UPLOAD_UPDATED_DATA_MESSAGE_LOADING,
      messageAction
    );

    (async () => {
      const response = await fetch(
        `${apiMatrix.PORTFOLIOS_UPDATE_BY_ID}/${selectedPortfolioId}`,
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
            messageMatrix.UPLOAD_UPDATED_DATA_MESSAGE_SUCCESS
          );
        }
      })
      .catch((error) => {
        handleMessage(
          messageKey,
          "error",
          `${messageMatrix.UPLOAD_UPDATED_DATA_MESSAGE_ERROR}${error}`
        );
        setIsUploading(false);
      });
  };

  const handleFormValueChange = () => {
    setFiledValue(form.getFieldValue());
  };

  const onFinish = (values) => {
    setIsUploading(true);
    handleUpdate(values);
  };

  const handleDisableSubmitBtn = () => {
    let isValueSame = true;
    let isHasError = false;

    if (filedValue.data) {
      const formValue = filedValue.data;
      const clonedPortfilioData = structuredClone(fetchedPortfolioData);
      delete clonedPortfilioData.createdAt;
      delete clonedPortfilioData.updatedAt;
      isValueSame =
        JSON.stringify(sortObjByKey(formValue)) ===
        JSON.stringify(sortObjByKey(clonedPortfilioData));
    } else isValueSame = true;

    if (!!form.getFieldsError().filter(({ errors }) => errors.length).length) {
      isHasError = true;
    } else isHasError = false;

    return isValueSame || isHasError;
  };

  const formProps = {
    allowClear: true,
    onChange: handleFormValueChange,
  };

  const formLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const loadedPageContent = (
    <div className={style.lw_portfolio_wrapper}>
      <Typography.Title level={4} className={style.lw_edit_protfolio_header}>
        Update Experience on {fetchedPortfolioData.name}
      </Typography.Title>
      <Form
        {...formLayout}
        name="portfolio"
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={{
          data: {
            name: fetchedPortfolioData.name,
            jobTitle: fetchedPortfolioData.jobTitle,
            projectName: fetchedPortfolioData.projectName,
            startDate: dayjs(fetchedPortfolioData.startDate),
            endDate: dayjs(fetchedPortfolioData.endDate),
            location: fetchedPortfolioData.location,
            keySkills: fetchedPortfolioData.keySkills,
            description: fetchedPortfolioData.description,
            jobContent: fetchedPortfolioData.jobContent,
            icon: fetchedPortfolioData.icon,
          },
        }}
        form={form}
      >
        <Form.Item
          name={["data", "name"]}
          label="Company Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input {...formProps} placeholder="Input Company Name" />
        </Form.Item>
        <Form.Item name={["data", "icon"]} label="Company Icon's Link">
          <Input.TextArea
            {...formProps}
            placeholder="Company Icon's Link"
            rows={2}
          />
        </Form.Item>
        <Form.Item
          name={["data", "jobTitle"]}
          label="Title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input {...formProps} placeholder="Input Title" />
        </Form.Item>
        <Form.Item name={["data", "projectName"]} label="Project name">
          <Input.TextArea
            {...formProps}
            placeholder="Input Project name"
            rows={4}
          />
        </Form.Item>
        <Form.Item
          name={["data", "startDate"]}
          label="Start Date"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker {...formProps} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name={["data", "endDate"]} label="End Date">
          <DatePicker {...formProps} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name={["data", "location"]}
          label="Location"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input {...formProps} placeholder="Input Location" />
        </Form.Item>
        <Form.Item
          name={["data", "keySkills"]}
          label="Key Skills"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea
            {...formProps}
            placeholder="Input Key Skills"
            rows={4}
          />
        </Form.Item>
        <Form.Item name={["data", "description"]} label="Project Description">
          <Input.TextArea
            {...formProps}
            placeholder="Input Project Description"
            rows={8}
          />
        </Form.Item>
        <Form.Item
          name={["data", "jobContent"]}
          label="Job Content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea
            {...formProps}
            placeholder="Input Job Content"
            rows={8}
          />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <div className={style.lw_edit_protfolio_btns_wrapper}>
              <Button
                className={style.lw_edit_protfolio_btns}
                type="default"
                onClick={handleGoback}
              >
                Cancel
              </Button>
              <Button
                className={style.lw_edit_protfolio_btns}
                type="primary"
                htmlType="submit"
                disabled={handleDisableSubmitBtn() || isUploading}
              >
                Submit
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
    </div>
  );

  const loadingPageContent = <Skeleton />;

  const pageContent = isPageLoading ? loadingPageContent : loadedPageContent;

  return <LwLayout content={pageContent} />;
};

export default EditPortfolio;
