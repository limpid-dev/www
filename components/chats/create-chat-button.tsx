import { Chat } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";
import api from "../../api";
import { Button } from "../primitives/button";

type Props = ComponentPropsWithoutRef<"button"> & {
  children?: ReactNode;
  userIds: number[];
  name: string;
};

export const CreateChatButton = forwardRef<HTMLButtonElement, Props>(
  ({ userIds, name, onClick, ...props }, ref) => {
    const router = useRouter();
    return (
      <Button
        variant="subtle"
        onClick={async (e) => {
          const chat = await api.createChat({
            user_ids: userIds,
            name,
          });
          onClick?.(e);
          await router.push(`/app/chats/${chat.data.data?.id!}`);
        }}
        className="text-xs w-11/12 font-bold"
        ref={ref}
        {...props}
      >
        <Chat className="w-6 h-6 mr-3" /> Написать сообщение
      </Button>
    );
  }
);
