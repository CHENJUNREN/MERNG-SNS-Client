import React, { useContext } from "react";
import { Card, Icon, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "./MyPopup";

interface Props {
	post: {
		id: string;
		body: string;
		createdAt: string;
		username: string;
		likeCount: number;
		likes: Array<{ username: string }>;
		commentCount: number;
		comments: Array<{
			id: string;
			username: string;
			createdAt: string;
			body: string;
		}>;
	};
}

const PostCard: React.FC<Props> = ({ post }) => {
	const { user } = useContext(AuthContext);

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com/images/avatar/large/molly.png"
				/>
				<Card.Header>{post.username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${post.id}`}>
					{moment(post.createdAt).fromNow()}
				</Card.Meta>
				<Card.Description>{post.body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton
					user={user}
					post={{
						id: post.id,
						likes: post.likes,
						likeCount: post.likeCount,
					}}
				/>
				<MyPopup content="Comment">
					<Button
						as={Link}
						to={`/posts/${post.id}`}
						color="grey"
						basic
					>
						<Icon name="comments" />
						{post.commentCount}
					</Button>
				</MyPopup>
				{user && user.username === post.username && (
					<DeleteButton postId={post.id} />
				)}
			</Card.Content>
		</Card>
	);
};

export default PostCard;
