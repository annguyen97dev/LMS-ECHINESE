import React, { useEffect, useState } from "react";
import { Table, Card, Button, Input } from "antd";
import TitlePage from "../Elements/TitlePage";
import { useWrap } from "~/context/wrap";

const ExpandTable = (props) => {
  const { getTitlePage } = useWrap();
  const [state, setState] = useState({ selectedRowKeys: [] });
  const [dataSource, setDataSource] = useState([]);

  const selectRow = (record) => {
    const selectedRowKeys = [];

    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    setState({ selectedRowKeys });
  };

  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setState({ selectedRowKeys });
  };

  const changePagination = (pageNumber) => {
    // console.log(pageNumber);
    if (typeof props.getPagination != "undefined") {
      props.getPagination(pageNumber);
    } else {
      return pageNumber;
    }
  };

  const rowSelection = {
      selectedRowKeys: state.selectedRowKeys,
      onChange: onSelectedRowKeysChange,
      hideSelectAll: true,
  };

  const { Search } = Input;

  useEffect(() => {
    if (props.TitlePage) {
      getTitlePage(props.TitlePage);
    }
    if (props.dataSource && props.dataSource.length > 0) {
      let dataClone = [...props.dataSource];
      dataClone.forEach((item, index) => {
        item.key = index.toString();
      });

      setDataSource(dataClone);
    }
  }, [props.dataSource]);

  return (
    <>
      {/* <TitlePage title={props.TitlePage} /> */}
      <div className={props.checkBox ? "wrap-table table-expand have-checkbox" : "wrap-table table-expand"}>
        <Card
          className={`cardRadius ${props.addClass && props.addClass}`}
          title={props.Extra}
          extra={props.TitleCard}
        >
          {props.children}
          <Table
              loading={
                props.loading?.type == "GET_ALL" && props.loading?.status
              }
              bordered={props.haveBorder ? props.haveBorder : false}
              scroll={props.noScroll ? { x: "max-content" } : { x: 600 }}
              columns={props.columns}
              dataSource={dataSource}
              size="middle"
              expandable={props.expandable}
              pagination={{
                total: props.totalPage && props.totalPage,
                onChange: (pageNumber) => changePagination(pageNumber),
                current: props.currentPage && props.currentPage,
              }}
              rowSelection={rowSelection}
              onRow={(record) => ({
                onClick: () => {
                  selectRow(record);
                },
              })}
          />
        </Card>
      </div>
    </>
  );
};

export default ExpandTable;
