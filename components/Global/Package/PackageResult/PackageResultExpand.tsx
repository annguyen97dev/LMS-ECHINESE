//@ts-nocheck
import React, { useEffect, useState } from "react";
import { packageResultApi } from "~/apiBase/package/package-result";
import NestedTable from "~/components/Elements/NestedTable";
import { useWrap } from "~/context/wrap";

const PackageResultExpand = (props) => {
  const { infoID } = props;
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [detail, setDetail] = useState<ISetPackageResult>([]);
  const { showNoti } = useWrap();

  const fetchDetailInfo = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      let res = await packageResultApi.getDetail(infoID);
      if (res.status == 200) {
        let arr = [];
        arr.push(res.data.data);
        setDetail(arr);
      }
    } catch (err) {
      showNoti("danger", err.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  useEffect(() => {
    fetchDetailInfo();
  }, []);

  const columns = [
    {
      title: "Tổng câu hỏi",
      dataIndex: "NumberExercise",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Số câu đúng",
      dataIndex: "CorrectNumber",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Số câu sai",
      dataIndex: "WrongNumber",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Điểm số",
      dataIndex: "Point",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Ghi chú",
      dataIndex: "Note",
    },
  ];

  return (
    <div className="container-fluid">
      <NestedTable
        loading={isLoading}
        addClass="basic-header"
        dataSource={detail}
        columns={columns}
      />
    </div>
  );
};

export default PackageResultExpand;
