"use client";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import Post from "./Post";
import { useSession } from "next-auth/react";

interface PostFeedProps {
	initialPosts: ExtendedPost[];
	subredditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
	const lastPostRef = useRef<HTMLElement>(null);
	const { ref, entry } = useIntersection({
		root: lastPostRef.current,
		threshold: 1,
	});
	const { data: session } = useSession();
	let posts = [];
	const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
		["infinite-query"],
		async ({ pageParam = 1 }) => {
			const query =
				`/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
				(!!subredditName ? `&subredditName=${subredditName}` : "");

			const { data } = await axios.get(query);
			return data as ExtendedPost[];
		},

		{
			getNextPageParam: (_, pages) => {
				return pages.length + 1;
			},
			initialData: { pages: [initialPosts], pageParams: [1] },
		},
	);

	useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage(); // Load more posts when the last post comes into view
		}
	}, [entry, fetchNextPage]);

	posts = (data?.pages.flatMap((page) => page) ?? initialPosts).filter((post) => post !== undefined);
	// remove all the undefined values from the array
	// this is necessary because the last page of posts will be undefined
	// until the next page is fetched

	return (
		<ul className="col-span-2 flex flex-col space-y-6">
			{posts.map((post, index) => {
				const votesAmt = post.votes.reduce((acc, vote) => {
					if (vote.type === "UP") return acc + 1;
					if (vote.type === "DOWN") return acc - 1;
					return acc;
				}, 0);

				const currentVote = post.votes.find((vote) => vote.userId === session?.user.id);

				if (index === posts.length - 1) {
					// Add a ref to the last post in the list
					return (
						<li key={post.id} ref={ref}>
							<Post
								post={post}
								commentAmt={post.comments.length}
								subredditName={post.subreddit.name}
								votesAmt={votesAmt}
								currentVote={currentVote}
							/>
						</li>
					);
				} else {
					return (
						<Post
							key={post.id}
							post={post}
							commentAmt={post.comments.length}
							subredditName={post.subreddit.name}
							currentVote={currentVote}
							votesAmt={votesAmt}
						/>
					);
				}
			})}

			{isFetchingNextPage && (
				<li className="flex justify-center">
					<Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
				</li>
			)}
		</ul>
	);
};

export default PostFeed;
