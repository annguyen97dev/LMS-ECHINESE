import React, { createContext, useContext, useState } from "react";
import { examDetailApi } from "~/apiBase";

export type IProps = {
  getListQuestionID: Function;
  listQuestionID: Array<Number>;
};

const DoingTestContext = createContext<IProps>({
  getListQuestionID: () => {},
  listQuestionID: [],
});

export const DoingTestProvider = ({ children }) => {
  const [listQuestionID, setListQuestionID] = useState([]);

  // --- GET LIST QUESTION ID ---
  const getListQuestionID = (listQuestionID: Array<Number>) => {
    setListQuestionID(listQuestionID);
  };

  return (
    <>
      <DoingTestContext.Provider
        value={{ getListQuestionID, listQuestionID: listQuestionID }}
      >
        {children}
      </DoingTestContext.Provider>
    </>
  );
};

export const useDoingTest = () => useContext(DoingTestContext);
