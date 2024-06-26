import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography, Skeleton, Descriptions, Button, Tooltip } from "antd";
import { EditOutlined, RollbackOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import apiMatrix from "../common/apiMatrix";
import messageMatrix from "../common/messageMatrix";
import categoryMatrix from "../common/categoryMatrix";
import globalStyleMatrix from "../common/globalStyleMatrix";
import CopyButton from "../common/CopyButton";
import OpenLinkButton from "../common/OpenLinkButton";
import LwLayout from "../common/LwLayout";
import handleMessage from "../utils/handleMessage";
import style from "./style/ReviewLeetCodes.module.css";

const ReviewLeetCodes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userInfoData = useSelector((state) => state.userInfoData);
  const selectedLeetcodeId = useSelector((state) => state.selectedLeetcodeId);
  const [isReviewPageLoading, setIsReviewPageLoading] = useState(true);
  const [fetchedLeetcodeData, setFetchedLeetcodeData] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const messageKey = "reviewPageLoadingMessage";

    (async () => {
      const response = await fetch(
        `${apiMatrix.LEET_CODES_GET_BY_ID}/${
          selectedLeetcodeId ? selectedLeetcodeId : id
        }`
      );
      return response.json();
    })()
      .then((response) => {
        if (response && response.error) {
          throw new Error(response.error.message);
        } else {
        }
        setFetchedLeetcodeData(response.data.attributes);
      })
      .catch((error) => {
        handleMessage(
          messageKey,
          "error",
          `${messageMatrix.LOADING_MESSAGE_ERROR}${error}`
        );
      })
      .finally(() => {
        setIsReviewPageLoading(false);
      });
  }, [selectedLeetcodeId, id]);

  const handleGoback = () => {
    navigate(-1);
  };

  const handleEditBtnOnClick = () => {
    navigate(`/${categoryMatrix.LEETCODES.toLowerCase()}/editLeetCodes`);
  };

  const loadedPageContent = (
    <>
      <Typography.Title
        level={4}
        className={style.lw_leetcode_review_leetcode_header}
      >
        {fetchedLeetcodeData.leetcodeIndex}. {fetchedLeetcodeData.title}
      </Typography.Title>
      <Descriptions
        bordered={windowWidth > 500 ? true : false}
        column={6}
        labelStyle={{
          color: globalStyleMatrix.COLORS.titleFontColor,
          fontWeight: globalStyleMatrix.FONT_WEIGHT.titleFontWeight,
        }}
        contentStyle={{ color: globalStyleMatrix.COLORS.mainFontColor }}
        className={style.lw_leetcode_review_leetcode_description_wrapper}
      >
        <Descriptions.Item label="LeedCode Index" span={6}>
          {fetchedLeetcodeData?.leetcodeIndex?.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Title" span={6}>
          {fetchedLeetcodeData?.title?.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Difficulty" span={6}>
          {fetchedLeetcodeData?.difficulty?.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="First Completed Date" span={6}>
          {fetchedLeetcodeData?.firstCompletedDate?.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Created Date" span={6}>
          {fetchedLeetcodeData?.createdAt?.toString().slice(0, 10)}
        </Descriptions.Item>
        <Descriptions.Item label="Updated Date" span={6}>
          {fetchedLeetcodeData?.updatedAt?.toString().slice(0, 10)}
        </Descriptions.Item>
        <Descriptions.Item label="LeetCode Page" span={6}>
          {fetchedLeetcodeData?.link?.toString()}
          <OpenLinkButton link={fetchedLeetcodeData?.link} />
          <CopyButton data={fetchedLeetcodeData?.link} />
        </Descriptions.Item>
        <Descriptions.Item label="Problem Type" span={6}>
          {fetchedLeetcodeData?.type?.toString()}
        </Descriptions.Item>
        {fetchedLeetcodeData?.issue && (
          <Descriptions.Item
            label={windowWidth > 500 ? "Problem Content" : ""}
            span={6}
          >
            <ReactMarkdown
              className={style.lw_leetcodes_review_leetcode_md_wrapper}
              children={fetchedLeetcodeData?.issue}
              remarkPlugins={[remarkGfm]}
            />
            <CopyButton data={fetchedLeetcodeData?.issue} />
          </Descriptions.Item>
        )}
        {fetchedLeetcodeData?.solutionOne && (
          <Descriptions.Item
            label={windowWidth > 500 ? "Problem Solution One" : ""}
            span={6}
          >
            <CodeMirror
              value={fetchedLeetcodeData?.solutionOne}
              extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
              height="auto"
              editable={false}
              theme={vscodeDark}
            />
            <CopyButton data={fetchedLeetcodeData?.solutionOne} />
          </Descriptions.Item>
        )}
        {fetchedLeetcodeData?.solutionTwo && (
          <Descriptions.Item
            label={windowWidth > 500 ? "Problem Solution Two" : ""}
            span={6}
          >
            <CodeMirror
              value={fetchedLeetcodeData?.solutionTwo}
              extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
              height="auto"
              editable={false}
              theme={vscodeDark}
            />
            <CopyButton data={fetchedLeetcodeData?.solutionTwo} />
          </Descriptions.Item>
        )}
      </Descriptions>
      <div className={style.lw_leetcodes_review_leetcode_btn_wrapper}>
        <Button
          className={style.lw_leetcodes_review_leetcode_btns}
          type="default"
          onClick={handleGoback}
          icon={<RollbackOutlined />}
        >
          Back
        </Button>
        <Tooltip
          title={
            !userInfoData.jwt ? "Please login with admin account to edit" : ""
          }
        >
          <Button
            className={style.lw_leetcodes_review_leetcode_btns}
            type="primary"
            onClick={handleEditBtnOnClick}
            icon={<EditOutlined />}
            disabled={!userInfoData.jwt}
          >
            Edit
          </Button>
        </Tooltip>
      </div>
    </>
  );

  const loadingPageContent = <Skeleton />;

  const pageContent = isReviewPageLoading
    ? loadingPageContent
    : loadedPageContent;

  return <LwLayout content={pageContent} />;
};

export default ReviewLeetCodes;
