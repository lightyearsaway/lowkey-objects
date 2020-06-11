/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/core";
import { Radio } from "antd";
import { getGray, getColoredObjectCss, getRed, getBlue } from "./styles";
import { Color } from "./types";
import { RadioChangeEvent } from "antd/lib/radio";

interface Props {
  newObjectColor: Color;
  changeNewColor: (e: RadioChangeEvent) => void;
  onAddObject: () => void;
}

const AddNewObjectButton: React.FC<Props> = ({
  newObjectColor,
  changeNewColor,
  onAddObject,
}) => (
  <div
    css={{
      ...getColoredObjectCss(null, false),
      border: `2px dashed ${getGray(0.5)}`,
      // negative margin to offset border
      margin: -2,
    }}
    onClick={onAddObject}
  >
    <div
      css={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: "100%",
        textAlign: "center",
        fontSize: 16,
        fontWeight: 500,
      }}
    >
      <div>+ Add new object</div>
      <div
        css={{ marginTop: 8 }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Radio.Group value={newObjectColor} onChange={changeNewColor}>
          {Object.entries(Color)
            .filter(([, v]) => typeof v === "number")
            .map(([k, v]) => {
              const alpha = v === newObjectColor ? 0.8 : 0.2;
              const colorGetter = v === Color.RED ? getRed : getBlue;
              return (
                <Radio.Button
                  key={v}
                  value={v}
                  css={{
                    "&.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)": {
                      background: colorGetter(alpha),
                    },
                    "&.ant-radio-button-wrapper:first-child": {
                      borderWidth: 0,
                    },
                    "&.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before": {
                      backgroundColor: "transparent",
                    },
                    background: colorGetter(alpha),
                    borderWidth: 0,
                  }}
                ></Radio.Button>
              );
            })}
        </Radio.Group>
      </div>
    </div>
  </div>
);

export default AddNewObjectButton;
