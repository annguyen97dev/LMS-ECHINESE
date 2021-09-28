import React from "react";
import LayoutBase from "~/components/LayoutBase";
import TitlePage from "~/components/Elements/TitlePage";

const ExerciseDone = () => {
  return (
    <div>
      <TitlePage title="Đã chấm" />
    </div>
  );
};

ExerciseDone.layout = LayoutBase;
export default ExerciseDone;
