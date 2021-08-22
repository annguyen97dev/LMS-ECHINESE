//@ts-nocheck
import React, { useEffect, useState } from "react";
import NestedTable from "~/components/Elements/NestedTable";
import { useWrap } from "~/context/wrap";

const PackageResultExpand = (props) => {
  const { info, infoIndex } = props;
  const [detail, setDetail] = useState<ISetPackageResult>([]);
  const { showNoti } = useWrap();

  const fetchDetailInfo = () => {
    try {
      let arr = [];
      arr.push(info);
      setDetail(arr);
    } catch (err) {
      showNoti("danger", err.message);
    }
  };

  useEffect(() => {
    fetchDetailInfo();
  }, [infoIndex]);

  console.log(detail);

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
        addClass="basic-header"
        dataSource={detail}
        columns={columns}
      />
    </div>
  );
};

export default PackageResultExpand;
