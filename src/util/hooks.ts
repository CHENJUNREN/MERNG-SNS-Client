import { useState } from "react";

interface StateInfo {
	username?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
	body?: string;
}

export const useForm = (callback: () => void, initialState = {}) => {
	const [values, setValues] = useState<StateInfo>(initialState);

	const onChange = (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		callback();
	};

	return {
		onChange,
		onSubmit,
		values,
	};
};
