import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
    const loginToast = () => {
        const { dismiss } = toast({
            title: "Login Required",
            description: "You must be logged in to do that.",
            variant: "destructive",
            action: (
                <Link
                    className={buttonVariants({ variant: "outline" })}
                    href={"/sign-in"}
                    onClick={() => dismiss()}
                >
                    Login
                </Link>
            ),
        });
    };
    return { loginToast };
};
