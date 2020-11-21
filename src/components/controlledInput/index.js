import React from "react"
import { TextareaAutosize } from "@material-ui/core"

export default function ControlledInput({
  state,
  setState,
  formatter,
  error,
  errorClass,
  inputClass,
  element,
  ...rest
}) {
  return (
    <>
      {element === "textarea" ? (
        <TextareaAutosize
          {...rest}
          onChange={(e) => {
            formatter
              ? formatter(e.target.value, setState)
              : setState(e.target.value)
          }}
          value={state}
          className={error ? `${inputClass} ${inputClass}--error` : inputClass}
        />
      ) : (
        <input
          {...rest}
          onChange={(e) => {
            formatter
              ? formatter(e.target.value, setState)
              : setState(e.target.value)
          }}
          value={state}
          className={error ? `${inputClass} ${inputClass}--error` : inputClass}
        />
      )}
      {error ? <p className={errorClass}>{error}</p> : null}
    </>
  )
}
