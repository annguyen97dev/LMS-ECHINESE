import React, { useEffect, useState } from "react";

import LayoutBase from "~/components/LayoutBase";
import CurriculumDetail from "~/components/Global/Option/ProgramDetail/CurriculumDetail";

const CurriculumDetailView = () => {
  return (
    <>
      <CurriculumDetail />
    </>
  );
};

CurriculumDetailView.layout = LayoutBase;
export default CurriculumDetailView;
