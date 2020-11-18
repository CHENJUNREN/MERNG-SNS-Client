import React, { useReducer, createContext } from "react";
import jwt_decode from "jwt-decode";

interface UserType {
	id: string;
	email: string;
	token: string;
	username: string;
	createdAt: string;
}

const initialState = {
	user: null,
};

const token = localStorage.getItem("jwtToken");
if (token) {
	const decodedToken: any = jwt_decode(token);
	if (decodedToken.exp * 1000 < Date.now()) {
		localStorage.removeItem("jwtToken");
	} else {
		initialState.user = {
			...decodedToken,
			token,
		};
	}
}

const AuthContext = createContext<{
	user: UserType | null;
	login: (userData: any) => void;
	logout: () => void;
}>({
	user: initialState.user,
	login: (userData) => {},
	logout: () => {},
});

const authReducer = (state: any, action: { type: any; payload?: any }) => {
	switch (action.type) {
		case "LOGIN":
			return {
				...state,
				user: action.payload,
			};
		case "LOGOUT":
			return {
				...state,
				user: null,
			};
		default:
			return state;
	}
};

const AuthProvider = (props: any) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	const login = (userData: UserType) => {
		localStorage.setItem("jwtToken", userData.token);
		dispatch({
			type: "LOGIN",
			payload: userData,
		});
	};

	const logout = () => {
		localStorage.removeItem("jwtToken");
		dispatch({
			type: "LOGOUT",
		});
	};

	return (
		<AuthContext.Provider
			value={{ user: state.user, login, logout }}
			{...props}
		/>
	);
};

export { AuthContext, AuthProvider };
