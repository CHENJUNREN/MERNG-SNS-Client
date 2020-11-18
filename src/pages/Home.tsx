import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

interface Props {}

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

interface GetPostsData {
	getPosts: Post[];
}

const Home: React.FC<Props> = () => {
	const { loading, data } = useQuery<GetPostsData>(FETCH_POSTS_QUERY);
	const { user } = useContext(AuthContext);

	return (
		<Grid columns={1}>
			{/* <Grid.Row className="page-title">
				<h1>Recent Posts:</h1>
			</Grid.Row> */}
			<Grid.Row>
				{user && (
					<Grid.Column style={{ marginBottom: 20 }}>
						<PostForm />
					</Grid.Column>
				)}
				{loading ? (
					<h1>Loading Posts...</h1>
				) : (
					<Transition.Group>
						{data &&
							data.getPosts.map((post) => (
								<Grid.Column
									key={post.id}
									style={{ marginBottom: 20 }}
								>
									<PostCard post={post} />
								</Grid.Column>
							))}
					</Transition.Group>
				)}
			</Grid.Row>
		</Grid>
	);
};

export default Home;
