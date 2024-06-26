import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Space } from "antd";
import HomeTopNav from "./HomeTopNav";
import HomeCardArea from "./HomeCardArea";
import LwLayout from "../common/LwLayout";
import categoryMatrix from "../common/categoryMatrix";
import apiMatrix from "../common/apiMatrix";
import messageMatrix from "../common/messageMatrix";
import handleMessage from "../utils/handleMessage";
import { SET_QUICK_LINK_DATA } from "../../redux/constants";

const Home = () => {
  const dispatch = useDispatch();
  const userInfoData = useSelector((state) => state.userInfoData);
  const showHomeCard = useSelector((state) => state.showHomeCard);

  useEffect(() => {
    const messageKey = "loadingMessage";

    (async () => {
      const response = await fetch(
        `${apiMatrix.QUICK_LINKS_GET_ALL}${
          userInfoData?.user?.username
            ? `?filters[user][$eq]=${userInfoData.user.username}&sort=order:asc&pagination[pageSize]=20`
            : ""
        }`
      );
      return response.json();
    })()
      .then((response) => {
        if (response && response.error) {
          throw new Error(response.error.message);
        } else {
          dispatch({ type: SET_QUICK_LINK_DATA, payload: response });
        }
      })
      .catch((error) => {
        handleMessage(
          messageKey,
          "error",
          `${messageMatrix.LOADING_MESSAGE_ERROR}${error}`
        );
      });
  }, [userInfoData?.user?.username, dispatch]);

  const pageContent = (
    <Space direction="vertical" align="center" wrap>
      <HomeTopNav />
      {showHomeCard && <HomeCardArea />}
    </Space>
  );

  return (
    <LwLayout
      direction="horizontal"
      content={pageContent}
      pageKey={categoryMatrix.HOME}
    />
  );
};

export default Home;
