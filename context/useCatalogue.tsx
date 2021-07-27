import React, { createContext, useContext, useEffect, useState } from "react";
import { supplierApi } from "~/apiBase";
import { useWrap } from "./wrap";

export type ICatalogueState = {
  listData: any;
};

const contextDefaultValues: ICatalogueState = {
  listData: null,
};

export const CatalogueContext =
  createContext<ICatalogueState>(contextDefaultValues);

export const CatalogueProvider = (props) => {
  const [listData, setListData] = useState(contextDefaultValues.listData);
  const { showNoti } = useWrap();

  const listParamsDefault = {
    pageSize: null,
    pageIndex: null,
    selectAll: true,
  };

  const fetchData = () => {
    (async () => {
      try {
        let res = await supplierApi.getAll(listParamsDefault);
        res.status == 200 && setListData(res.data.data);
      } catch (error) {
        showNoti("danger", error.message);
      }
    })();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CatalogueContext.Provider value={{ listData }}>
      {props.children}
    </CatalogueContext.Provider>
  );
};

export const useCatalogue = () => useContext(CatalogueContext);
