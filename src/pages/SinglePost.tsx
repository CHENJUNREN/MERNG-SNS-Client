import React, { useContext, useState, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import {
	Button,
	Card,
	Transition,
	Image,
	Comment,
	Header,
	Form,
} from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

interface Props extends RouteComponentProps<any> {}

interface Post {
	id: string;
	body: string;
	createdAt: string;
	username: string;
	likeCount: number;
	likes: { username: string }[];
	commentCount: number;
	comments: {
		id: string;
		username: string;
		createdAt: string;
		body: string;
	}[];
}

interface GetPostData {
	getPost: Post;
}

const FETCH_POST_QUERY = gql`
	query fetchPost($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

const SUBMMIT_COMMENT_MUTATION = gql`
	mutation addComment($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
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

const SinglePost: React.FC<Props> = ({ match, history }) => {
	const postId = match.params.postId;
	const { user } = useContext(AuthContext);
	const [comment, setComment] = useState("");
	const commentInputRef = useRef<any>(null);

	const { data, loading } = useQuery<GetPostData>(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	const [submitComment] = useMutation(SUBMMIT_COMMENT_MUTATION, {
		update: () => {
			setComment("");
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment,
		},
	});

	let postMarkup;
	if (loading) {
		postMarkup = <p>Loading Post...</p>;
	} else {
		if (data) {
			const {
				id,
				body,
				createdAt,
				username,
				likeCount,
				likes,
				commentCount,
				comments,
			} = data.getPost;

			postMarkup = (
				<>
					<Card fluid>
						<Card.Content>
							<Image
								floated="left"
								size="mini"
								src="https://react.semantic-ui.com/images/avatar/large/molly.png"
							/>
							<Card.Header>{username}</Card.Header>
							<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
							<Card.Description>{body}</Card.Description>
						</Card.Content>
						<Card.Content extra>
							<LikeButton
								user={user}
								post={{
									id: id,
									likes: likes,
									likeCount: likeCount,
								}}
							/>
							{user && user.username === username && (
								<DeleteButton
									postId={id}
									callback={() => history.push("/")}
								/>
							)}
						</Card.Content>
					</Card>
					<Card fluid>
						<Card.Content>
							<Comment.Group>
								<Header as="h3" dividing>
									Comments ({commentCount})
								</Header>
								<Transition.Group>
									{comments.length === 0 ? (
										<p>Nothing here...</p>
									) : (
										comments.map((comment) => (
											<Comment key={comment.id}>
												<Comment.Avatar src="https://react.semantic-ui.com/images/avatar/large/molly.png" />
												<Comment.Content>
													<Comment.Author>
														{comment.username}
													</Comment.Author>
													<Comment.Metadata>
														<div>
															{moment(
																comment.createdAt
															).fromNow()}
														</div>
													</Comment.Metadata>
													<Comment.Text>
														<p>{comment.body}</p>
													</Comment.Text>
													{user &&
														user.username ===
															comment.username && (
															<Comment.Actions>
																<DeleteButton
																	postId={
																		postId
																	}
																	commentId={
																		comment.id
																	}
																/>
															</Comment.Actions>
														)}
												</Comment.Content>
											</Comment>
										))
									)}
								</Transition.Group>
								{user && (
									<Form
										reply
										onSubmit={() => {
											submitComment();
										}}
									>
										<input
											type="text"
											value={comment}
											placeholder="Add Comment..."
											onChange={(event) => {
												setComment(event.target.value);
											}}
											ref={commentInputRef}
										/>
										<Button
											type="submit"
											content="Submit"
											style={{ marginTop: 10 }}
											icon="edit"
											basic
											floated="right"
											disabled={comment.trim() === ""}
										/>
									</Form>
								)}
							</Comment.Group>
						</Card.Content>
					</Card>
				</>
			);
		}
	}

	return <>{postMarkup}</>;
};

export default SinglePost;
