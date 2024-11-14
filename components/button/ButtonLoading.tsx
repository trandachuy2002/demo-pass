import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type Props = {
    onClick: (e?: any) => void;
    title: string | ReactNode,
    disabled?: boolean
    className?: string
    type?: "button" | "submit" | "reset"
    isStateloading: boolean,
    style?: React.CSSProperties,
    classLoading?: string,
}
const ButtonLoading = ({
    onClick,
    style,
    title,
    disabled,
    className,
    isStateloading,
    type,
    classLoading = 'border-current'
}: Props) => {

    return (

        <Button
            style={style}
            onClick={(e: any) => onClick(e)}
            type={type ? type : "button"}
            className={`${className} flex items-center gap-2`}
            disabled={disabled}

        >
            {
                isStateloading &&
                <span
                    className={`${classLoading} text-white inline-block min-h-4 min-w-4 h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} />
            }
            <span>{title}</span>
        </Button>
    )
}
export default ButtonLoading