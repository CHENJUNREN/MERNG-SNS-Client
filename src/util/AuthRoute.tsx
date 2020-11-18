import React, { useContext } from "react";
import {
	Route,
	Redirect,
	RouteProps,
	RouteComponentProps,
} from "react-router-dom";

import { AuthContext } from "../context/auth";

interface Props extends RouteProps {
	component:
		| React.ComponentType<RouteComponentProps<any>>
		| React.ComponentType<any>;
}

const AuthRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
	const { user } = useContext(AuthContext);

	return (
		<Route
			{...rest}
			render={(props) =>
				user ? <Redirect to="/" /> : <Component {...props} />
			}
		/>
	);
};

export default AuthRoute;
