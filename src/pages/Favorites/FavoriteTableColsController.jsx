import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Popover, Switch } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { SET_FAVORITE_TABLE_COLUMNS } from "../../redux/constants";
import style from "./style/FavoriteTableColsController.module.css";

const FavoriteTableColsController = () => {
  const dispatch = useDispatch();
  const favoriteTableColumns = useSelector(
    (state) => state.favoriteTableColumns
  );

  const handleTogleChange = (type, value) => {
    switch (type) {
      case "name":
        dispatch({
          type: SET_FAVORITE_TABLE_COLUMNS,
          payload: { ...favoriteTableColumns, name: value },
        });
        break;
      case "type":
        dispatch({
          type: SET_FAVORITE_TABLE_COLUMNS,
          payload: { ...favoriteTableColumns, type: value },
        });
        break;
      case "createdAt":
        dispatch({
          type: SET_FAVORITE_TABLE_COLUMNS,
          payload: { ...favoriteTableColumns, createdAt: value },
        });
        break;
      case "updatedAt":
        dispatch({
          type: SET_FAVORITE_TABLE_COLUMNS,
          payload: { ...favoriteTableColumns, updatedAt: value },
        });
        break;
      case "description":
        dispatch({
          type: SET_FAVORITE_TABLE_COLUMNS,
          payload: { ...favoriteTableColumns, description: value },
        });
        break;
      case "action":
        dispatch({
          type: SET_FAVORITE_TABLE_COLUMNS,
          payload: { ...favoriteTableColumns, action: value },
        });
        break;
      default:
        break;
    }
  };

  const content = (
    <div>
      <ul>
        <div className={style.lw_favorites_tableColsController_title}>
          Title:
        </div>
        <Switch
          checkedChildren="Show"
          unCheckedChildren="Hide"
          className={style.lw_favorites_tableColsController_switch}
          checked={favoriteTableColumns.name}
          size="medium"
          onChange={(value) => handleTogleChange("name", value)}
        />
      </ul>
      <ul>
        <div className={style.lw_favorites_tableColsController_title}>
          Created At:
        </div>
        <Switch
          checkedChildren="Show"
          unCheckedChildren="Hide"
          className={style.lw_favorites_tableColsController_switch}
          checked={favoriteTableColumns.createdAt}
          size="medium"
          onChange={(value) => handleTogleChange("createdAt", value)}
        />
      </ul>
      <ul>
        <div className={style.lw_favorites_tableColsController_title}>
          Updated At:
        </div>
        <Switch
          checkedChildren="Show"
          unCheckedChildren="Hide"
          className={style.lw_favorites_tableColsController_switch}
          checked={favoriteTableColumns.updatedAt}
          size="medium"
          onChange={(value) => handleTogleChange("updatedAt", value)}
        />
      </ul>
      <ul>
        <div className={style.lw_favorites_tableColsController_title}>
          Description:
        </div>
        <Switch
          checkedChildren="Show"
          unCheckedChildren="Hide"
          className={style.lw_favorites_tableColsController_switch}
          checked={favoriteTableColumns.description}
          size="medium"
          onChange={(value) => handleTogleChange("description", value)}
        />
      </ul>
      <ul>
        <div className={style.lw_favorites_tableColsController_title}>
          Action:
        </div>
        <Switch
          checkedChildren="Show"
          unCheckedChildren="Hide"
          className={style.lw_favorites_tableColsController_switch}
          checked={favoriteTableColumns.action}
          size="medium"
          onChange={(value) => handleTogleChange("action", value)}
        />
      </ul>
    </div>
  );

  return (
    <>
      <Popover content={content} trigger="click">
        <Button className={style.lw_favorites_tableColsController_btn}>
          Columns Setup <DownOutlined />
        </Button>
      </Popover>
    </>
  );
};

export default FavoriteTableColsController;
