import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import ToFeedButton from "@/components/ToFeedButton";
const Layout = async ({ children, params: { slug } }: { children: React.ReactNode; params: { slug: string } }) => {
	const session = await getAuthSession();
	const subreddit = await db.subreddit.findFirst({
		where: {
			name: slug,
		},
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	});
	const subscription = session?.user
		? await db.subscription.findFirst({
				where: {
					subreddit: {
						name: slug,
					},
					user: {
						id: session.user.id,
					},
				},
		  })
		: null;
	const isSubscribed = !!subscription;
	if (!subreddit) return notFound();
	const memberCount = await db.subscription.count({
		where: {
			subreddit: {
				name: slug,
			},
		},
	});
	return (
		<div className={"mx-auto h-full max-w-7xl pt-12 sm:container"}>
			<div className={""}>
				<ToFeedButton />
				<div className={"grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4"}>
					<div className={"col-span-2 flex flex-col space-y-6"}>{children}</div>
					<div
						className={
							"border-gray200 order-first hidden h-fit overflow-hidden rounded-lg md:order-last md:block"
						}
					>
						<div className={"px-6 py-4 "}>
							<p className={"py-3 font-semibold"}>About r/{subreddit.name}</p>
						</div>
						<dl className={"divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6"}>
							<div className={"flex justify-between gap-x-4 py-3"}>
								<dt className="text-gray-500">Created</dt>
								<time dateTime={subreddit.createdAt.toDateString()}>
									{format(subreddit.createdAt, "MMMM dd, yyyy")}
								</time>
							</div>
							<div className="flex justify-between gap-x-4 py-3">
								<dt className="text-gray-500">Members</dt>
								<dd className="flex items-start gap-x-2">
									<div className="text-gray-900">{memberCount}</div>
								</dd>
							</div>

							{subreddit.creatorId === session?.user?.id ? (
								<div className="flex justify-between gap-x-4 py-3">
									<dt className="text-gray-500">You created this community</dt>
								</div>
							) : null}

							{subreddit.creatorId !== session?.user?.id ? (
								<SubscribeLeaveToggle
									isSubscribed={isSubscribed}
									subredditId={subreddit.id}
									subredditName={subreddit.name}
								/>
							) : null}
							<Link
								className={buttonVariants({
									variant: "outline",
									className: "mb-6 w-full",
								})}
								href={`r/${slug}/submit`}
							>
								Create Post
							</Link>
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Layout;
