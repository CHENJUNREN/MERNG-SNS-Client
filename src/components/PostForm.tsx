import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

interface Props {}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

const PostForm: React.FC<Props> = () => {
	const { onChange, onSubmit, values } = useForm(createPostCallback, {
		body: "",
	});

	const [error, setError] = useState<string | null>(null);

	const [createPost] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update: (proxy, result) => {
			// const data = proxy.readQuery<any>({
			// 	query: FETCH_POSTS_QUERY,
			// });
			// const updatedPosts = [result.data.createPost, ...data.getPosts];
			// proxy.writeQuery({
			// 	query: FETCH_POSTS_QUERY,
			// 	data: { updatedPosts },
			// });
			values.body = "";
		},
		refetchQueries: [
			{
				query: FETCH_POSTS_QUERY,
			},
		],
		onError: (err) => {
			setError(err.graphQLErrors[0].message);
		},
	});

	function createPostCallback() {
		createPost();
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create a new post:</h2>
				<Form.Field>
					<Form.TextArea
						placeholder="Type here..."
						name="body"
						onChange={onChange}
						value={values.body}
						error={error ? true : false}
					/>
					<Button
						type="submit"
						color="grey"
						floated="right"
						basic
						icon="edit"
						content="Submit"
						disabled={values.body?.trim() === "" ? true : false}
					/>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{ marginBottom: 20 }}>
					<ul className="list">
						<li>{error}</li>
					</ul>
				</div>
			)}
		</>
	);
};

export default PostForm;
