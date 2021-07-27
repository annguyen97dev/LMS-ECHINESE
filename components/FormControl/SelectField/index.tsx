import { Form, Select } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { Controller } from "react-hook-form";

const SelectField = (props) => {
  const {
    form,
    name,
    label,
    optionList,
    placeholder,
    disabled,
    mode,
    onChangeSelect,
    isLoading,
  } = props;
  const { Option } = Select;
  const { errors } = form.formState;
  const hasError = errors[name];
  const checkOnChangeSelect = (value) => {
    if (!onChangeSelect) return;
    onChangeSelect(value);
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
        render={({ field }) => {
          return (
            <Select
              {...field}
              mode={mode}
              className="style-input"
              showSearch
              loading={isLoading}
              style={{ width: "100%" }}
              placeholder={placeholder}
              optionFilterProp="children"
              disabled={disabled}
              onChange={(value) => {
                checkOnChangeSelect(value);
                field.onChange(value);
              }}
            >
              {optionList.map((o, idx) => (
                <Option key={idx} value={o.value}>
                  {o.title}
                </Option>
              ))}
            </Select>
          );
        }}
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
  mode: PropTypes.string,
  onChangeSelect: PropTypes.func,
  isLoading: PropTypes.bool,
};
SelectField.defaultProps = {
  optionList: [],
  label: "",
  placeholder: "",
  disabled: false,
  onChangeSelect: null,
  mode: "",
  isLoading: false,
};
export default SelectField;
