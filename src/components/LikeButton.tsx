import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { Button, Icon } from "semantic-ui-react";
import MyPopup from "./MyPopup";

interface UserInfo {
	id: string;
	email: string;
	token: string;
	username: string;
	createdAt: string;
}

interface Props {
	post: {
		id: string;
		likeCount: number;
		likes: Array<{ username: string }>;
	};
	user: UserInfo | null;
}

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

const LikeButton: React.FC<Props> = ({
	post: { id, likeCount, likes },
	user,
}) => {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (user && likes.find((like) => like.username === user.username)) {
			setLiked(true);
		} else setLiked(false);
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id },
	});

	const onClick = () => {
		likePost();
	};

	const likeButton = user ? (
		liked ? (
			<Button color="red" onClick={onClick}>
				<Icon name="like" />
				{likeCount}
			</Button>
		) : (
			<Button color="red" basic onClick={onClick}>
				<Icon name="like" />
				{likeCount}
			</Button>
		)
	) : (
		<Button as={Link} to="/login" color="red" basic>
			<Icon name="like" />
			{likeCount}
		</Button>
	);

	return (
		<>
			<MyPopup content={liked ? "Unlike" : "Like"}>{likeButton}</MyPopup>
		</>
	);
};

export default LikeButton;
