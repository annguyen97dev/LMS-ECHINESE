import { DatePicker, Form, Popover, Select } from "antd";
import React, { useState } from "react";
import { Filter } from "react-feather";
import { Roles } from "~/lib/roles/listRoles";
import { useForm } from "react-hook-form";

const FilterFeedbackTable = (props: any) => {
  const [showFilter, setShowFilter] = useState(false);
  const { Option } = Select;

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();

  const onSubmit = handleSubmit((data: any) => {
    props._onFilter(data);
    setShowFilter(false);
  });

  const content = (
    <div className={`wrap-filter small`}>
      <Form layout="vertical" onFinish={onSubmit}>
        <div className="row">
          <div className="col-md-12">
            <Form.Item label="Role">
              <Select
                className="style-input"
                placeholder="Chọn role"
                onChange={(value) => setValue("RoleID", value)}
                allowClear={true}
              >
                {Roles.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.RoleName}
                  </Option>
                ))}

                <Option value="disabled" disabled>
                  Disabled
                </Option>
              </Select>
            </Form.Item>
          </div>
          <div className="col-md-12">
            <Form.Item className="mb-0">
              <button
                className="btn btn-primary"
                style={{ marginRight: "10px" }}
                onClick={onSubmit}
              >
                Tìm kiếm
              </button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );

  return (
    <>
      <div className="wrap-filter-parent">
        <Popover
          visible={showFilter}
          placement="bottomRight"
          content={content}
          trigger="click"
          overlayClassName="filter-popover"
        >
          <button
            className="btn btn-secondary light btn-filter"
            onClick={() => {
              showFilter ? setShowFilter(false) : setShowFilter(true);
            }}
          >
            <Filter />
          </button>
        </Popover>
      </div>
    </>
  );
};

export default FilterFeedbackTable;
