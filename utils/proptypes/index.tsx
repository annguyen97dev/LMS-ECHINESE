import PropTypes from 'prop-types';

export const optionCommonPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
		options: PropTypes.object,
		disabled: PropTypes.bool
	})
);
export const radioCommonPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
		disabled: PropTypes.bool
	})
);
export const checkboxCommonPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
		disabled: PropTypes.bool
	})
);
