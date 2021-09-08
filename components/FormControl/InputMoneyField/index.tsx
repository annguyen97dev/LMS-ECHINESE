import { Form, Input } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { Controller } from "react-hook-form";

const InputMoneyField = (props) => {
  const {
    form,
    name,
    label,
    placeholder,
    disabled,
    handleChange,
    style,
    className,
  } = props;

  const { errors } = form.formState;
  const hasError = errors[name];

  const checkHandleChange = (value) => {
    if (!handleChange) return;
    handleChange(value);
  };

  // FORMAT NUMBER
  //   const formatNumber = (e) => {
  //     let value = e.target.value;

  //     value = parseInt(value.replace(/\,/g, ""), 10);
  //     console.log("VALUE: ", value.toLocaleString());
  //     if (!isNaN(value)) {
  //       formSalary.setValue("Salary", newValue.toLocaleString());
  //       console.log("VALUE: ", newValue);
  //     } else {
  //       formSalary.setValue("Salary", "");
  //     }

  //   };

  return (
    <Form.Item
      style={style}
      label={label}
      className={`${className} ${
        hasError ? "ant-form-item-with-help ant-form-item-has-error" : ""
      }`}
    >
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            className="style-input"
            allowClear={true}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => {
              let convertValue = e.target.value.toString();
              let value = parseInt(convertValue.replace(/\,/g, ""), 10);
              // let value = new Intl.NumberFormat("vi-VN", {
              //   style: "currency",
              //   currency: "VND",
              // }).format(parseInt(e.target.value));
              // value = value.replace(" ₫", "");
              // let newValue = parseFloat(value);

              if (!isNaN(value)) {
                field.onChange(value.toLocaleString());
                console.log("VALUE: ", value);
              } else {
                field.onChange("");
              }
            }}
          />
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
InputMoneyField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
  style: PropTypes.shape({}),
  className: PropTypes.string,
};
InputMoneyField.defaultProps = {
  label: "",
  placeholder: "",
  disabled: false,
  handleChange: null,
  style: {},
  className: "",
};
export default InputMoneyField;
