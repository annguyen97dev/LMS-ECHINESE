import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import ProvincialForm from "~/components/Global/Option/ProvincialForm";
import LayoutBase from "~/components/LayoutBase";
import { areaApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const Provincial = () => {
  const columns = [
    {
      title: "Mã tỉnh/thành phố",
      dataIndex: "AreaCode",
      ...FilterColumn("AreaCode"),
    },
    {
      title: "Tên tỉnh/thành phố",
      dataIndex: "AreaName",
      ...FilterColumn("AreaName"),
    },
    // { title: "Districts", dataIndex: "district", ...FilterColumn("district") },
    {
      title: "Modified By",
      dataIndex: "ModifiedBy",
      ...FilterColumn("ModifiedBy"),
    },
    {
      title: "Modified Date",
      dataIndex: "ModifiedOn",
      ...FilterDateColumn("ModifiedOn"),
    },

    {
      render: () => (
        <>
          <ProvincialForm showIcon={true} />
        </>
      ),
    },
  ];

  const [area, setArea] = useState<IArea[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const { showNoti } = useWrap();

  const getDataArea = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await areaApi.getAll();
        res.status == 200 && setArea(res.data.createAcc);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "GET_ALL",
          status: false,
        });
      }
    })();
  };

  useEffect(() => {
    getDataArea();
  }, []);

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Provincial List"
      TitleCard={<ProvincialForm showAdd={true} />}
      dataSource={area}
      columns={columns}
      loading={isLoading}
      Extra={
        <div className="extra-table">
          <SortBox />
        </div>
      }
    />
  );
};
Provincial.layout = LayoutBase;
export default Provincial;
