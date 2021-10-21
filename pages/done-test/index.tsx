import React, { useEffect, useState } from "react";
import DoneTestMain from "~/components/Global/DoneTest/DoneTestMain";
import LayoutBase from "~/components/LayoutBase";
import { DoneTestProvider } from "~/context/useDoneTest";
import { DoingTestProvider } from "~/context/useDoingTest";

const DoneTest = () => {
  return (
    <>
      <DoingTestProvider>
        <DoneTestProvider>
          <DoneTestMain />
        </DoneTestProvider>
      </DoingTestProvider>
    </>
  );
};

DoneTest.layout = LayoutBase;
export default DoneTest;
