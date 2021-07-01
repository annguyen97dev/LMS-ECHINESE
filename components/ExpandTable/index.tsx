import React from "react";
import { Table, Card, Button, Input } from "antd";
import TitlePage from "../Elements/TitlePage";
import { useWrap } from "~/context/wrap";

const ExpandTable = (props) => {
  const { getTitlePage } = useWrap();

  getTitlePage(props.TitlePage);

  const { Search } = Input;

  return (
    <>
      {/* <TitlePage title={props.TitlePage} /> */}
      <div className="wrap-table">
        <Card
          className={`cardRadius ${props.addClass && props.addClass}`}
          title={props.Extra}
          extra={props.TitleCard}
        >
          {props.children}
          <Table
            scroll={props.noScroll ? { x: "max-content" } : { x: 768 }}
            columns={props.columns}
            dataSource={props.dataSource}
            expandable={props.expandable}
            size="middle"
          />
        </Card>
      </div>
    </>
  );
};

export default ExpandTable;
