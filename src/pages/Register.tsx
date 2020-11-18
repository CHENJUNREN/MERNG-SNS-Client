import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";
import { RouteComponentProps } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

interface Props extends RouteComponentProps {}

interface ErrorType {
	username?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

const REGISTER_USER = gql`
	mutation register_user(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			token
			username
			createdAt
		}
	}
`;

const Register: React.FC<Props> = ({ history }) => {
	const context = useContext(AuthContext);
	const { onChange, onSubmit, values } = useForm(registerUser, {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState<ErrorType>({});

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update: (_, { data: { register: userData } }) => {
			context.login(userData);
			history.push("/");
		},
		onError: (err) => {
			if (err.graphQLErrors[0].extensions) {
				setErrors(err.graphQLErrors[0].extensions.errors);
			}
		},
		variables: values,
	});

	function registerUser() {
		addUser();
	}

	return (
		<div className="form-container">
			<Form
				onSubmit={onSubmit}
				noValidate
				className={loading ? "loading" : ""}
			>
				<h1>Register</h1>
				<Form.Input
					label="Username"
					placeholder="Username..."
					name="username"
					type="text"
					value={values.username}
					error={errors.username ? true : false}
					onChange={onChange}
				/>
				<Form.Input
					label="Email"
					placeholder="Email..."
					name="email"
					type="email"
					error={errors.email ? true : false}
					value={values.email}
					onChange={onChange}
				/>
				<Form.Input
					label="Password"
					placeholder="Password..."
					name="password"
					error={errors.password ? true : false}
					type="password"
					value={values.password}
					onChange={onChange}
				/>
				<Form.Input
					label="Confirm Password"
					placeholder="Confirm Password..."
					error={errors.confirmPassword ? true : false}
					name="confirmPassword"
					type="password"
					value={values.confirmPassword}
					onChange={onChange}
				/>
				<Button type="submit" color="grey">
					Submit
				</Button>
			</Form>
			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map((element) => (
							<li key={element}>{element}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Register;
