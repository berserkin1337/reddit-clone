import { FC } from "react";
import { Icons } from "./Icons";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

const SignIn: FC = ({}) => {
	return (
		<div className="jusitfy-center mx-auto flex w-full flex-col space-y-6 sm:w-[400px]">
			<div className="flex flex-col space-y-2 ">
				<Icons.logo className="mx-auto h-6 w-6 " />
				<h1 className="text-center text-2xl font-semibold tracking-tight">Welcome Back</h1>
				<p className="mx-auto max-w-xs text-sm">
					By continuing,you are setting up a Breadit account and you agree to our User Agreement and Privacy
					Policy.
				</p>
				<UserAuthForm />
				<p className={"px-8 text-center text-sm  text-zinc-700 "}>
					New to Breadit?{" "}
					<Link href={"/sign-up"} className="text-sm underline underline-offset-4  hover:text-zinc-800 ">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignIn;
