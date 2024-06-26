import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout, Menu, ConfigProvider } from "antd";
import {
  AppstoreOutlined,
  Html5Outlined,
  UserOutlined,
  HomeOutlined,
  StarOutlined,
  SmileOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { SiLeetcode } from "react-icons/si";
import categoryMatrix from "./categoryMatrix";
import HeaderLinks from "./HeaderLinks";
import HomePageLayoutSetup from "./HomePageLayoutSetup";
import style from "./style/LwHeader.module.css";

const LwHeader = () => {
  const location = useLocation();
  const userInfoData = useSelector((state) => state.userInfoData);
  const showHomeMenu = useSelector((state) => state.showHomeMenu);
  const showHomeLink = useSelector((state) => state.showHomeLink);
  const selectedKeys = location.pathname.slice(1);
  const menuItems = [
    {
      label: <Link to="/">{categoryMatrix.HOME}</Link>,
      key: categoryMatrix.HOME.toLowerCase(),
      icon: <HomeOutlined />,
    },
    {
      label: (
        <Link to={`/${categoryMatrix.LEETCODES.toLowerCase()}`}>
          {categoryMatrix.LEETCODES}
        </Link>
      ),
      key: categoryMatrix.LEETCODES.toLowerCase(),
      icon: <SiLeetcode />,
    },
    {
      label: (
        <Link to={`/${categoryMatrix.APPLICATIONS.toLowerCase()}`}>
          {categoryMatrix.APPLICATIONS}
        </Link>
      ),
      key: categoryMatrix.APPLICATIONS.toLowerCase(),
      icon: <AppstoreOutlined />,
    },
    {
      label: (
        <Link to={`/${categoryMatrix.COMPONENTS.toLowerCase()}`}>
          {categoryMatrix.COMPONENTS}
        </Link>
      ),
      key: categoryMatrix.COMPONENTS.toLowerCase(),
      icon: <Html5Outlined />,
    },
    {
      label: (
        <Link to={`/${categoryMatrix.FAVORITES.toLowerCase()}`}>
          {categoryMatrix.FAVORITES}
        </Link>
      ),
      key: categoryMatrix.FAVORITES.toLowerCase(),
      icon: <StarOutlined />,
    },
    {
      label: (
        <Link to={`/${categoryMatrix.BULLETINBOARDS.toLowerCase()}`}>
          Bulletin Board
        </Link>
      ),
      key: categoryMatrix.BULLETINBOARDS.toLowerCase(),
      icon: <MessageOutlined />,
    },
    {
      label: (
        <Link to={`/${categoryMatrix.PORTFOLIO.toLowerCase()}`}>About Me</Link>
      ),
      key: categoryMatrix.PORTFOLIO.toLowerCase(),
      icon: <SmileOutlined />,
    },
    {
      label: (
        <Link to={`/${categoryMatrix.USER.toLowerCase()}`}>
          {userInfoData?.jwt
            ? `Hello! ${userInfoData?.user?.username}`
            : "Login/Register"}
        </Link>
      ),
      key: categoryMatrix.USER.toLowerCase(),
      icon: <UserOutlined />,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#212121",
          colorInfoHover: "#FFFFFF",
          colorBgSpotlight: "#212121",
        },
      }}
    >
      <Layout.Header className={style.lw_header_wrapper}>
        {showHomeMenu && (
          <Menu
            className={style.lw_header_menu}
            theme="dark"
            mode="horizontal"
            items={menuItems}
            defaultSelectedKeys={["home"]}
            selectedKeys={[selectedKeys === "" ? "home" : selectedKeys]}
          />
        )}
        <HomePageLayoutSetup />
        {showHomeLink && <HeaderLinks />}
      </Layout.Header>
    </ConfigProvider>
  );
};

export default LwHeader;
