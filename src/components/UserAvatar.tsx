import { FC } from "react";
import { User } from "next-auth";
import Image from "next/image";
import { Icons } from "@/components/Icons";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
	user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
	return (
		<Avatar {...props}>
			{user.image ? (
				<div className={"relative aspect-square h-full w-full "}>
					<Image src={user.image} alt={"profile picture"} referrerPolicy={"no-referrer"} fill={true} />
				</div>
			) : (
				<AvatarFallback>
					<span className={"sr-only"}>{user?.name}</span>
					<Icons.user className={"h-4 w-4"} />
				</AvatarFallback>
			)}
		</Avatar>
	);
};

export default UserAvatar;
