declare type IFormBaseProps = {
	visible: boolean;
	onCancel?: any;
	reloadData?: Function;
};
type IOptionCommon = {
	title: string;
	value: string | number;
	options?: { [k: string]: any };
	date?: string;
	disabled?: boolean;
};
