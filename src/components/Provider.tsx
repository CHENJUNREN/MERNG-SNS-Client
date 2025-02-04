import App from "../App";
import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	ApolloProvider,
} from "@apollo/client";
import React from "react";
import { setContext } from "@apollo/link-context";

const httpLink = createHttpLink({
	uri: "https://morning-refuge-92909.herokuapp.com/",
});

const authLink = setContext(() => {
	const token = localStorage.getItem("jwtToken");
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

const Provider: React.FC = () => {
	return (
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	);
};

export default Provider;
