import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined, Html5Outlined } from "@ant-design/icons";
import categoryMatrix from "../common/categoryMatrix";
import style from "./style/ComponentTopBtns.module.css";

const ComponentTopBtns = () => {
  const navigate = useNavigate();
  const userInfoData = useSelector((state) => state.userInfoData);

  const handleBtnOnClick = (type) => {
    switch (type.toLowerCase()) {
      case "create":
        navigate(
          `/${categoryMatrix.COMPONENTS.toLowerCase()}/createComponents`
        );
        break;
      case "uiverse":
        window.open("https://uiverse.io/", "_blank", "noopener, noreferrer");
        break;
      case "angrytools":
        window.open(
          "https://angrytools.com/",
          "_blank",
          "noopener, noreferrer"
        );
        break;
      case "animista":
        window.open("https://animista.net/", "_blank", "noopener, noreferrer");
        break;
      case "flatuicolors":
        window.open(
          "https://flatuicolors.com/",
          "_blank",
          "noopener, noreferrer"
        );
        break;
      case "antd":
        window.open("https://ant.design/", "_blank", "noopener, noreferrer");
        break;
      case "mui":
        window.open("https://mui.com/", "_blank", "noopener, noreferrer");
        break;
      case "reacticons":
        window.open(
          "https://react-icons.github.io/react-icons",
          "_blank",
          "noopener, noreferrer"
        );
        break;

      default:
        return null;
    }
  };

  return (
    <div>
      {userInfoData?.user?.username === "tenghanzhi" && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleBtnOnClick("create")}
          disabled={!userInfoData.jwt}
          className={style.lw_component_topBtns_btns}
        >
          Create New
        </Button>
      )}
      <Button
        type="default"
        icon={<Html5Outlined />}
        onClick={() => handleBtnOnClick("uiverse")}
        className={style.lw_component_topBtns_btns}
      >
        Open-Source UI
      </Button>
      <Button
        type="default"
        icon={<Html5Outlined />}
        onClick={() => handleBtnOnClick("angrytools")}
        className={style.lw_component_topBtns_btns}
      >
        Angry Tools
      </Button>
      <Button
        type="default"
        icon={<Html5Outlined />}
        onClick={() => handleBtnOnClick("animista")}
        className={style.lw_component_topBtns_btns}
      >
        Animista
      </Button>
      <Button
        type="default"
        icon={<Html5Outlined />}
        onClick={() => handleBtnOnClick("flatuicolors")}
        className={style.lw_component_topBtns_btns}
      >
        Flat UI Colors
      </Button>
      <Button
        type="default"
        icon={<Html5Outlined />}
        onClick={() => handleBtnOnClick("antd")}
        className={style.lw_component_topBtns_btns}
      >
        Ant Design
      </Button>
      <Button
        type="default"
        icon={<Html5Outlined />}
        onClick={() => handleBtnOnClick("mui")}
        className={style.lw_component_topBtns_btns}
      >
        MUI
      </Button>
      <Button
        type="default"
        icon={<Html5Outlined />}
        onClick={() => handleBtnOnClick("reacticons")}
        className={style.lw_component_topBtns_btns}
      >
        React Icons
      </Button>
    </div>
  );
};

export default ComponentTopBtns;
