import React from "react";
import LayoutBase from "~/components/LayoutBase";
import TitlePage from "~/components/Elements/TitlePage";

const NewListExercise = () => {
  return (
    <div>
      <TitlePage title="Bài tập mới" />
    </div>
  );
};

NewListExercise.layout = LayoutBase;
export default NewListExercise;
