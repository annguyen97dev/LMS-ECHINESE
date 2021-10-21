import React from "react";
import { Volume2 } from "react-feather";
import { Slider } from "antd";

const ControlVolume = (props) => {
  const { getValueControl } = props;

  const getValueSlider = (value) => {
    getValueControl && getValueControl(value);
  };

  return (
    <div className="control-volume">
      <Volume2 />
      <Slider
        defaultValue={100}
        className="sound-edit"
        onChange={getValueSlider}
      />
    </div>
  );
};

export default ControlVolume;
