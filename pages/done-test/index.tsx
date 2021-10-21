import React, { useEffect, useState } from "react";
import DoneTestMain from "~/components/Global/DoneTest/DoneTestMain";
import LayoutBase from "~/components/LayoutBase";
import { DoneTestProvider } from "~/context/useDoneTest";

const DoneTest = () => {
  return (
    <>
      <DoneTestProvider>
        <DoneTestMain />
      </DoneTestProvider>
    </>
  );
};

DoneTest.layout = LayoutBase;
export default DoneTest;
