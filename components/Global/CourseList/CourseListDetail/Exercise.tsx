import { Card, Input, Select, Tabs, Tooltip } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Link from "next/link";
import React, { Fragment } from "react";
import { Eye } from "react-feather";
import PowerTable from "~/components/PowerTable";
import { dataStudent } from "~/lib/customer/dataStudent";
import ExerciseCreateGr from "./ExerciseCreateGr";
import ExerciseCreateQues from "./ExerciseCreateQues";
import ExerciseEditGr from "./ExerciseEditGr";

const Exercise = () => {
  const { TabPane } = Tabs;
  return (
    <Fragment>
      <Card
        title="Exercise"
        extra={
          <Fragment>
            <ExerciseEditGr />

            <ExerciseCreateGr />

            <ExerciseCreateQues />
          </Fragment>
        }
      >
        <Tabs type="card" centered>
          <TabPane tab="Essay" key="1"></TabPane>
          <TabPane tab="Multiple-choice" key="2"></TabPane>
          <TabPane tab="Speaking" key="3"></TabPane>
        </Tabs>
      </Card>
    </Fragment>
  );
};
export default Exercise;
