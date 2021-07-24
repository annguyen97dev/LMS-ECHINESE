import React from "react";
import PropTypes from "prop-types";
import { Form, Select } from "antd";
import { Controller } from "react-hook-form";

const SelectField = (props) => {
  const { form, name, label, optionList, placeholder, disabled, getValue } =
    props;
  const { Option } = Select;
  const { errors } = form.formState;
  const hasError = errors[name];

  const handleChange = (value) => {
    if (typeof getValue != "undefined") {
      getValue(value);
    }
  };

  return (
    <Form.Item
      label={label}
      className={`${
        hasError ? "ant-form-item-with-help ant-form-item-has-error" : ""
      }`}
    >
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            className="style-input"
            showSearch
            style={{ width: "100%" }}
            placeholder={placeholder}
            optionFilterProp="children"
            disabled={disabled}
            // onChange={handleChange}
          >
            {optionList.map((o, idx) => (
              <Option key={idx} value={o.value}>
                {o.title}
              </Option>
            ))}
          </Select>
        )}
      />
      {hasError && (
        <div className="ant-form-item-explain ant-form-item-explain-error">
          <div role="alert">{errors[name]?.message}</div>
        </div>
      )}
    </Form.Item>
  );
};

SelectField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  optionList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  getValue: PropTypes.func,
};
SelectField.defaultProps = {
  optionList: [],
  label: "",
  placeholder: "",
  disabled: false,
};
export default SelectField;
