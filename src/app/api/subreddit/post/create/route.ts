import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();
		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}
		const body = await req.json();
		const { subredditId, title, content } = PostValidator.parse(body);
		// verify user is subscribed to passed subreddit id
		const subscription = await db.subscription.findFirst({
			where: {
				subredditId,
				userId: session.user.id,
			},
		});
		if (!subscription) {
			return new Response("Subscribe to post", { status: 400 });
		}

		await db.post.create({
			data: {
				subredditId,
				title,
				authorId: session.user.id,
				content,
			},
		});
		return new Response("Post created");
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}

		return new Response("Could not post to the subreddit", { status: 500 });
	}
}
