"use client";
import React, { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";
import UserAvatar from "@/components/UserAvatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface MiniCreatePostProps {
	session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<li className={"bg-white-shadow list-none overflow-hidden rounded-md bg-white"}>
			<div className={"flex h-full justify-between gap-6 px-6 py-4"}>
				<div className={"relative"}>
					<UserAvatar
						user={{
							name: session?.user.name || null,
							image: session?.user.image || null,
						}}
					/>
					<span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white" />
				</div>
				<Input onClick={() => router.push(pathname + "/submit")} readOnly placeholder="Create post" />
				<Button onClick={() => router.push(pathname + "/submit")} variant="ghost">
					<ImageIcon className="text-zinc-600" />
				</Button>
				<Button onClick={() => router.push(pathname + "/submit")} variant="ghost">
					<Link2 className="text-zinc-600" />
				</Button>
			</div>
		</li>
	);
};

export default MiniCreatePost;
