/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import "./App.css";
import { Color, ObjectActionType, ColoredObject, ObjectAction } from "./types";
import { getColoredObjectCss } from "./styles";
import { RadioChangeEvent } from "antd/lib/radio";

import AddNewObjectButton from "./AddNewObjectButton";
import { Dropdown } from "antd";
import ActionsMenu from "./ActionsMenu";
import { getNextId } from "./utils";

const getOtherColor = (color: Color) =>
  color === Color.RED ? Color.BLUE : Color.RED;

const reducer = (state: Array<ColoredObject>, action: ObjectAction) => {
  switch (action.type) {
    case ObjectActionType.ADD_OBJECT:
      const newState = state.map((obj) => ({ ...obj, selected: false }));
      newState.push({ id: action.id, color: action.color, selected: false });
      return newState;
    case ObjectActionType.DELETE_SELECTED_OBJECTS:
      return state.filter((obj) => !obj.selected);
    case ObjectActionType.SELECT_CONSECUTIVE:
      const firstSelectedIdx = state.findIndex((obj) => obj.selected);
      if (firstSelectedIdx === -1) {
        return state.map((obj, idx) => ({
          ...obj,
          selected: action.idx === idx,
        }));
      }
      if (action.idx <= firstSelectedIdx) {
        // select all from newly clicked object to first selected object,
        // and preserve selected state of any selected objects immediately
        // following the first selected object
        let chainFromFirstSelected = false;
        return state.map((obj, idx) => {
          if (idx === firstSelectedIdx) {
            chainFromFirstSelected = true;
          } else if (idx > firstSelectedIdx && !obj.selected) {
            chainFromFirstSelected = false;
          }
          return {
            ...obj,
            selected:
              (idx >= action.idx && idx <= firstSelectedIdx) ||
              chainFromFirstSelected,
          };
        });
      }
      return state.map((obj, idx) => ({
        ...obj,
        selected: idx <= action.idx && idx >= firstSelectedIdx,
      }));
    case ObjectActionType.TOGGLE_SINGLE:
      return state.map((obj) => ({
        ...obj,
        selected: obj.id === action.id ? !obj.selected : obj.selected,
      }));
    case ObjectActionType.SELECT_SINGLE:
      return state.map((obj) => ({
        ...obj,
        selected: obj.id === action.id,
      }));
    case ObjectActionType.SET_SELECTED_COLOR:
      return state.map((obj) => ({
        ...obj,
        color: obj.selected ? action.color : obj.color,
      }));
    case ObjectActionType.TOGGLE_COLOR:
      return state.map((obj) => ({
        ...obj,
        color: obj.selected ? getOtherColor(obj.color) : obj.color,
      }));
  }
};

function App() {
  const [newObjectColor, setNewObjectColor] = React.useState<Color>(Color.RED);
  const storedObjects = window.localStorage.getItem("objects");
  let initialObjects: Array<ColoredObject> = [];
  if (storedObjects) {
    initialObjects = JSON.parse(storedObjects);
  }
  const [objects, dispatch] = React.useReducer(reducer, initialObjects);

  React.useEffect(() => {
    window.localStorage.setItem("objects", JSON.stringify(objects));
  }, [objects]);

  const onAddObject = React.useCallback(() => {
    dispatch({
      type: ObjectActionType.ADD_OBJECT,
      color: newObjectColor,
      id: getNextId(),
    });
  }, [newObjectColor]);

  const changeNewColor = (e: RadioChangeEvent) => {
    setNewObjectColor(e.target.value);
  };

  const onObjectClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!(e.target instanceof HTMLDivElement)) {
        return;
      }

      // only on left click
      if (e.type === "click") {
        if (e.shiftKey) {
          dispatch({
            type: ObjectActionType.SELECT_CONSECUTIVE,
            idx: Number(
              e.target.dataset.idx || e.target.parentElement?.dataset.idx
            ),
          });
        } else if (e.ctrlKey) {
          dispatch({
            type: ObjectActionType.TOGGLE_SINGLE,
            id: Number(
              e.target.dataset.id || e.target.parentElement?.dataset.id
            ),
          });
        }
      }
    },
    []
  );

  const onObjectRightClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!(e.target instanceof HTMLDivElement)) {
        return;
      }
      const idx = Number(
        e.target.dataset.idx || e.target.parentElement?.dataset.idx
      );
      const object = objects[idx];
      if (!object.selected) {
        dispatch({ type: ObjectActionType.SELECT_SINGLE, id: object.id });
      }
    },
    [objects]
  );

  const isSetRedEnabled = objects.some(
    (obj) => obj.selected && obj.color !== Color.RED
  );
  const isSetBlueEnabled = objects.some(
    (obj) => obj.selected && obj.color !== Color.BLUE
  );

  return (
    <div css={{ background: "#222", minHeight: "100vh" }}>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gridGap: 20,
          padding: 20,
        }}
      >
        {objects.map((obj, idx) => (
          <Dropdown
            key={obj.id}
            overlay={
              <ActionsMenu
                dispatch={dispatch}
                id={obj.id}
                isSetRedEnabled={isSetRedEnabled}
                isSetBlueEnabled={isSetBlueEnabled}
              />
            }
            trigger={["contextMenu"]}
          >
            <div
              // padding-bottom set to 100% of width to maintain squares
              // https://stackoverflow.com/questions/5445491/height-equal-to-dynamic-width-css-fluid-layout
              css={getColoredObjectCss(obj.color, obj.selected)}
              data-id={obj.id}
              data-idx={idx}
              onClick={onObjectClick}
              onContextMenu={onObjectRightClick}
            >
              <div
                css={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: 48,
                }}
              >
                {obj.id}
              </div>
            </div>
          </Dropdown>
        ))}
        <AddNewObjectButton
          newObjectColor={newObjectColor}
          onAddObject={onAddObject}
          changeNewColor={changeNewColor}
        />
      </div>
    </div>
  );
}

export default App;
