import Styles from "@styles/Chat/ProtectedChnlForm.module.css"
import { joinChannel, JoinChannel } from "@hooks/useFetchData"
import CloseIcon from "@public/Cross.svg"
import React, { Dispatch, SetStateAction, useRef, useState } from "react"
import { validPassword } from "./CreateChannel"
import { motion } from "framer-motion"
import { useOutsideAlerter } from "@hooks/Functions"

export const ProtectedChnlForm: React.FC<{ convId: string; closeForm: Dispatch<SetStateAction<boolean>>, refresh: () => void }> = ({
	convId,
  closeForm,
  refresh
}) => {
	const [enteredPasswd, setEnteredPasswd] = useState<string>("")
	const [formError, setFormError] = useState<string>("")
  const refForm = useRef(null);

	const inputOnchangeHandler = (event: any) => {
		setEnteredPasswd(event.target.value)
	}

	const formOnsubmithandler = async (event: any) => {
		event.preventDefault()
		if (validPassword.test(enteredPasswd)) {
			const res: boolean = await joinChannel(convId, enteredPasswd)
			if (!res) setFormError("Wrong password!")
      else {
        refresh();
        closeForm(false)
      }
		} else
			setFormError(
				"Password must contain at least 8 characters, At least one number, one uppercase letter and one special character"
			)
	}

  useOutsideAlerter(refForm, (t: boolean) => closeForm(t));

	return (
		<>
			<motion.div
				className={Styles.ProtectedFormBackground}
				initial={{
					opacity: 0,
				}}
				animate={{
					opacity: 1,
				}}>
				<motion.div
        ref={refForm}
					initial={{
						opacity: 0,
						scale: 0.1,
					}}
					animate={{
						opacity: 1,
						scale: 1,
					}}>
					<form className={Styles.ProtectedFormContainer} onSubmit={formOnsubmithandler}>
						<div className={Styles.ProtectedFormHeader}>
							Add Member
							<img src={CloseIcon.src} onClick={() => closeForm(false)} ></img>
						</div>
						<input type={"password"} value={enteredPasswd} onChange={inputOnchangeHandler} />
						{formError.length > 0 && <p className={Styles.FormError}>{formError}</p>}
						<input type="submit" value={"Join"} />
					</form>
				</motion.div>
			</motion.div>
		</>
	)
}
