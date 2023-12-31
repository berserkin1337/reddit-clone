import CommentsSection from "@/components/CommentsSection";
import EditorOutput from "@/components/EditorOutput";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface SubRedditPostPageProps {
	params: {
		postId: string;
	};
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const SubRedditPostPage = async ({ params }: SubRedditPostPageProps) => {
	const cachedPost = null as unknown as CachedPost;

	let post: (Post & { votes: Vote[]; author: User }) | null = null;

	if (!cachedPost) {
		post = await db.post.findFirst({
			where: {
				id: params.postId,
			},
			include: {
				votes: true,
				author: true,
			},
		});
	}

	if (!post && !cachedPost) return notFound();

	return (
		<div>
			<div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start">
				<Suspense fallback={<PostVoteShell />}>
					<PostVoteServer
						postId={post?.id ?? cachedPost.id}
						getData={async () => {
							return await db.post.findUnique({
								where: {
									id: params.postId,
								},
								include: {
									votes: true,
								},
							});
						}}
					/>
				</Suspense>

				<div className="w-full flex-1 rounded-sm bg-white p-4 sm:w-0">
					<p className="mt-1 max-h-40 truncate text-xs text-gray-500">
						Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
						{formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
					</p>
					<h1 className="py-2 text-xl font-semibold leading-6 text-gray-900">
						{post?.title ?? cachedPost.title}
					</h1>

					<EditorOutput content={post?.content ?? cachedPost.content} />
					<Suspense fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />}>
						<CommentsSection postId={post?.id ?? cachedPost.id} />
					</Suspense>
				</div>
			</div>
		</div>
	);
};

function PostVoteShell() {
	return (
		<div className="flex w-20 flex-col items-center pr-6">
			{/* upvote */}
			<div className={buttonVariants({ variant: "ghost" })}>
				<ArrowBigUp className="h-5 w-5 text-zinc-700" />
			</div>

			{/* score */}
			<div className="py-2 text-center text-sm font-medium text-zinc-900">
				<Loader2 className="h-3 w-3 animate-spin" />
			</div>

			{/* downvote */}
			<div className={buttonVariants({ variant: "ghost" })}>
				<ArrowBigDown className="h-5 w-5 text-zinc-700" />
			</div>
		</div>
	);
}

export default SubRedditPostPage;
