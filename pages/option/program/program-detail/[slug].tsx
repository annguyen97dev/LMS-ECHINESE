import React, { useEffect, useState } from "react";

import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";

import Curriculum from "~/components/Global/Option/ProgramDetail/Curriculum";
import Subject from "~/components/Global/Option/ProgramDetail/Subject";

const Program = () => {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <TitlePage title="Giáo trình - Môn học" />
        </div>
      </div>
      <div className="row">
        <div className="col-md-5 col-12">
          <Subject />
        </div>
        <div className="col-md-7 col-12">
          <Curriculum />
        </div>
      </div>
    </>
  );
};
Program.layout = LayoutBase;
export default Program;
