import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react"
import api from "../../api"
import { useRouter } from "next/router"

type Props = ComponentPropsWithoutRef<'button'> & {
    children?: ReactNode
    userIds: number[]
    name: string
}


export const CreateChatButton = forwardRef<HTMLButtonElement, Props>(({ userIds, name, onClick, ...props }, ref) => {
    const router= useRouter()
    return <button onClick={async (e) => {
        const chat = await api.createChat({
            user_ids: userIds,
            name
        })
        onClick && onClick(e)
        await router.push(`/app/chats/${chat.data.data?.id!}`)
    }} ref={ref} {...props} />
})