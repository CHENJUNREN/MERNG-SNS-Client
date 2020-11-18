import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";
import { RouteComponentProps } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

interface Props extends RouteComponentProps {}

interface ErrorType {
	username?: string;
	password?: string;
}

const LOGIN_USER = gql`
	mutation login_user($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			token
			username
			createdAt
		}
	}
`;

const Login: React.FC<Props> = ({ history }) => {
	const context = useContext(AuthContext);
	const { onChange, onSubmit, values } = useForm(loginUserCallback, {
		username: "",
		password: "",
	});

	const [errors, setErrors] = useState<ErrorType>({});

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update: (_, { data: { login: userData } }) => {
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

	function loginUserCallback() {
		loginUser();
	}

	return (
		<div className="form-container">
			<Form
				onSubmit={onSubmit}
				noValidate
				className={loading ? "loading" : ""}
			>
				<h1>Login</h1>
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
					label="Password"
					placeholder="Password..."
					name="password"
					error={errors.password ? true : false}
					type="password"
					value={values.password}
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

export default Login;
