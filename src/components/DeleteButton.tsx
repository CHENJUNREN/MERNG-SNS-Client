import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Icon, Confirm, Comment } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "./MyPopup";

interface Props {
	postId: string;
	commentId?: string;
	callback?: () => void;
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

const DeleteButton: React.FC<Props> = ({ postId, commentId, callback }) => {
	const [open, setOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrComment] = useMutation(mutation, {
		update: () => {
			setOpen(false);
			if (callback) callback();
		},
		variables: {
			postId,
			commentId,
		},
		refetchQueries: [
			{
				query: FETCH_POSTS_QUERY,
			},
		],
	});

	return (
		<>
			{commentId ? (
				<Comment.Action onClick={() => setOpen(true)}>
					Delete
				</Comment.Action>
			) : (
				<MyPopup content="Delete post">
					<Button
						as="div"
						color="red"
						floated="right"
						basic
						onClick={() => setOpen(true)}
					>
						<Icon name="trash" style={{ margin: 0 }} />
					</Button>
				</MyPopup>
			)}
			<Confirm
				size="mini"
				dimmer="inverted"
				open={open}
				onCancel={() => setOpen(false)}
				onConfirm={() => deletePostOrComment()}
			/>
		</>
	);
};

export default DeleteButton;
