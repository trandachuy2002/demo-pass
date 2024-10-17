
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useAuthStore } from "@/store/authStores"
import { useAlertDialogStore } from "@/store/useAlertDialogStore"
import useCookieStore from "@/store/useCookieStore"
import { Button } from '../ui/button'

type Props = {}

const AlertDialogCustom = (props: Props) => {
    const { removeCookie } = useCookieStore()

    const { setInformationUser, } = useAuthStore()

    const { openAlertDialog, setOpenAlertDialog, type } = useAlertDialogStore()

    const handleLogout = () => {
        removeCookie("token_p")
        removeCookie("username")
        setInformationUser(undefined)
    }

    return (
        <AlertDialog open={openAlertDialog} onOpenChange={() => setOpenAlertDialog(false, '')}>
            <AlertDialogOverlay className='bg-black/20' />
            {
                type === 'logout' &&
                <AlertDialogContent className='max-w-[380px]'>
                    <AlertDialogHeader className='text-start'>
                        <AlertDialogTitle>Bạn có muốn đăng xuất không?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Xác nhận đăng xuất
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex flex-row justify-end'>
                        <Button
                            type="button"
                            onClick={() => setOpenAlertDialog(false, '')}
                            className='3xl:text-base text-sm w-fit py-3 px-6 3xl:gap-2 gap-1 3xl:rounded-2xl rounded-xl cursor-pointer hover:scale-105 hover:bg-transparent transition-all overflow-hidden bg-transparent text-[#585F71]'
                        >
                            Hủy
                        </Button>
                        <AlertDialogAction
                            onClick={handleLogout}
                            type="button"
                            className='3xl:text-base text-sm  w-fit py-3 px-6 3xl:gap-2 gap-1 3xl:rounded-2xl rounded-xl cursor-pointer hover:scale-105 hover:bg-blue-400 transition-all overflow-hidden bg-blue-500 text-white'
                        >
                            Đăng xuất
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            }
        </AlertDialog>
    )
}

export default AlertDialogCustom