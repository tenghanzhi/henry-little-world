import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Space } from "antd";
import apiMatrix from "../common/apiMatrix";
import messageMatrix from "../common/messageMatrix";
import categoryMatrix from "../common/categoryMatrix";
import FavoritesList from "./FavoritesList";
import FavoritesTable from "./FavoritesTable";
import FavoritesTopBtns from "./FavoritesTopBtns";
import FavoritesFilter from "./FavoritesFilter";
import FavoriteTableColsController from "./FavoriteTableColsController";
import LwLayout from "../common/LwLayout";
import { SET_FAVORITE_DATA } from "../../redux/constants";
import handleMessage from "../utils/handleMessage";
import style from "./style/Favorites.module.css";

const Favorites = () => {
  const dispatch = useDispatch();
  const favoriteTablePagenation = useSelector(
    (state) => state.favoriteTablePagenation
  );
  const favoriteTableSorter = useSelector((state) => state.favoriteTableSorter);
  const favoriteTableFilter = useSelector((state) => state.favoriteTableFilter);

  useEffect(() => {
    const messageKey = "loadingMessage";

    (async () => {
      const response = await fetch(
        `${apiMatrix.FAVORITE_GET_ALL}?pagination[page]=${
          favoriteTablePagenation.current
        }&pagination[pageSize]=${favoriteTablePagenation.size}&sort=${
          favoriteTableSorter.sort
        }${favoriteTableSorter.order}${
          favoriteTableFilter.name
            ? `&filters[name][$containsi][0]=${favoriteTableFilter.name}`
            : ""
        }${
          favoriteTableFilter.type
            ? `&filters[type][$containsi][1]=${favoriteTableFilter.type}`
            : ""
        }`
      );
      return response.json();
    })()
      .then((response) => {
        if (response && response.error) {
          throw new Error(response.error.message);
        } else {
          dispatch({ type: SET_FAVORITE_DATA, payload: response });
        }
      })
      .catch((error) => {
        handleMessage(
          messageKey,
          "error",
          `${messageMatrix.LOADING_MESSAGE_ERROR}${error}`
        );
      });
  }, [
    dispatch,
    favoriteTablePagenation,
    favoriteTableSorter,
    favoriteTableFilter,
  ]);

  const pageContent = (
    <Space direction="vertical" wrap align="start">
      <Space wrap className={style.lw_favorite_btn_wrapper}>
        <FavoritesTopBtns />
        <FavoriteTableColsController />
        <FavoritesFilter />
      </Space>
      <FavoritesTable />
      <FavoritesList />
    </Space>
  );

  return <LwLayout content={pageContent} pageKey={categoryMatrix.FAVORITES} />;
};

export default Favorites;
