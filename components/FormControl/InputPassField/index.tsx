import { Form, Input } from "antd";
import React from "react";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const InputPassField = (props) => {
  const { form, name, label, placeholder, disabled, handleChange } = props;

  const { errors } = form.formState;
  const hasError = errors[name];

  const checkHandleChange = (value) => {
    if (!handleChange) return;
    handleChange(value);
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
          <Input.Password
            {...field}
            className="style-input"
            allowClear={true}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => (
              checkHandleChange(e.target.value), field.onChange(e.target.value)
            )}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
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
InputPassField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
};
InputPassField.defaultProps = {
  label: "",
  placeholder: "",
  disabled: false,
};
export default InputPassField;
