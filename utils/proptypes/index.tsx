import PropTypes from 'prop-types';

export const optionCommonPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		options: PropTypes.shape({}),
	})
);
export const radioCommonPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		label: PropTypes.string.isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		disabled: PropTypes.bool,
	})
);
