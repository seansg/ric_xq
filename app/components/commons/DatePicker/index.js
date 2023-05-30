import { useState, useCallback } from 'react'
import Datepicker from "tailwind-datepicker-react"

const defaultOptions = {
	autoHide: true,
	todayBtn: false,
  clearBtn: false,
  maxDate: new Date(),
	theme: {
		background: "bg-gray-700 dark:bg-gray-800",
		todayBtn: "",
		icons: "",
		text: "",
		input: "",
		inputIcon: "",
		selected: "",
    disabledText: "bg-gray-700 rounded-none",
	},
	icons: {
		prev: () => '<',
		next: () => '>',
	},
	defaultDate: new Date(),
	language: "en",
}

const DatePicker = ({ options = defaultOptions, onChange }) => {
  const [show, setShow] = useState(false)
  const handleClose = (state) => {
		setShow(state)
	}
  const handleChange = useCallback((selectedDate) => {
		onChange(selectedDate)
	}, [onChange])

  return (
     <Datepicker options={options} onChange={handleChange} show={show} setShow={handleClose} />
  )
}

export default DatePicker