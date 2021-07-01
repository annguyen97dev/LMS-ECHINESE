import React, { useEffect, useState } from "react";
import { Table, Card } from "antd";
import TitlePage from "~/components/TitlePage";
import { useWrap } from "~/context/wrap";

const PowerTable = React.memo((props: any) => {
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
      <div className="row">
        <div className="col-12">
          {/* <TitlePage title={props.TitlePage} /> */}
          <div className="wrap-table">
            <Card
              className={`cardRadius ${props.addClass && props.addClass} ${
                props.Size ? props.Size : ""
              }`}
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
                pagination={{
                  onChange: (pageNumber) => changePagination(pageNumber),
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
        </div>
      </div>
    </>
  );
});

export default PowerTable;
