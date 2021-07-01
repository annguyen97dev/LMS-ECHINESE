import React from "react";
import { Filter } from "react-feather";

const FilterBase = () => {
  const funcShowFilter = () => {
    console.log("hello");
  };

  return (
    <>
      <button
        className="btn btn-secondary light btn-filter"
        onClick={funcShowFilter}
      >
        <Filter />
      </button>
    </>
  );
};

export default FilterBase;
