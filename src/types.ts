export enum Color {
  RED,
  BLUE,
}

export enum ObjectActionType {
  ADD_OBJECT,
  DELETE_SELECTED_OBJECTS,
  SELECT_CONSECUTIVE,
  TOGGLE_SINGLE,
  SELECT_SINGLE,
  SET_SELECTED_COLOR,
  TOGGLE_COLOR,
}

export interface ColoredObject {
  id: number;
  color: Color;
  selected: boolean;
}

export type ObjectAction =
  | { type: ObjectActionType.ADD_OBJECT; color: Color; id: number }
  | { type: ObjectActionType.DELETE_SELECTED_OBJECTS; id: number }
  | { type: ObjectActionType.SELECT_CONSECUTIVE; idx: number }
  | { type: ObjectActionType.TOGGLE_SINGLE; id: number }
  | { type: ObjectActionType.SELECT_SINGLE; id: number }
  | { type: ObjectActionType.SET_SELECTED_COLOR; color: Color }
  | { type: ObjectActionType.TOGGLE_COLOR };
