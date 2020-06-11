/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { ObjectAction, ObjectActionType, Color } from "./types";
import { Menu } from "antd";
import {
  getRed,
  getBlue,
  menuItemSwatchStyle,
  menuItemWrapperStyle,
} from "./styles";

interface Props {
  dispatch: (value: ObjectAction) => void;
  id: number;
  isSetRedEnabled: boolean;
  isSetBlueEnabled: boolean;
  numSelectedObjects: number;
}

const ActionsMenu: React.FC<Props> = ({
  dispatch,
  id,
  isSetRedEnabled,
  isSetBlueEnabled,
  numSelectedObjects,
}) => {
  const onDelete = React.useCallback(() => {
    dispatch({
      type: ObjectActionType.DELETE_SELECTED_OBJECTS,
      id,
    });
  }, [dispatch, id]);

  const setRed = React.useCallback(() => {
    dispatch({
      type: ObjectActionType.SET_SELECTED_COLOR,
      color: Color.RED,
    });
  }, [dispatch]);

  const setBlue = React.useCallback(() => {
    dispatch({
      type: ObjectActionType.SET_SELECTED_COLOR,
      color: Color.BLUE,
    });
  }, [dispatch]);

  const toggleColor = React.useCallback(() => {
    dispatch({
      type: ObjectActionType.TOGGLE_COLOR,
    });
  }, [dispatch]);

  return (
    <Menu>
      <Menu.Item onClick={onDelete} key="delete">
        Delete {numSelectedObjects}{" "}
        {numSelectedObjects !== 1 ? "objects" : "object"}
      </Menu.Item>
      <Menu.Item disabled={!isSetRedEnabled} key="set-red" onClick={setRed}>
        <div css={menuItemWrapperStyle}>
          Set to{" "}
          <div
            css={{
              ...menuItemSwatchStyle,
              background: getRed(1),
            }}
          />
        </div>
      </Menu.Item>
      <Menu.Item disabled={!isSetBlueEnabled} key="set-blue" onClick={setBlue}>
        <div css={menuItemWrapperStyle}>
          Set to{" "}
          <div
            css={{
              ...menuItemSwatchStyle,
              background: getBlue(1),
            }}
          />
        </div>
      </Menu.Item>
      <Menu.Item key="toggle-color" onClick={toggleColor}>
        Toggle color
      </Menu.Item>
    </Menu>
  );
};

export default ActionsMenu;
