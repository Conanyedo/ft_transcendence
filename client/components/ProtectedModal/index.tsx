import Styles from "@styles/chat.module.css"
import { motion } from "framer-motion"
import Image from "next/image"
import Cross from "@public/Cross.svg"
import { useState } from "react"
import { Button } from "@components/Modal"
import { useRouter } from "next/router"
import { JoinChannel } from "@hooks/useFetchData"

export const ProtectedFormMdl: React.FC<{convId: string}> = ({convId}) => {

    const [inputVal, setInputVal] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const closePopup = () => {
        // props.setShowSetModal(!props.showSetModal)
    }

    const handleChange = (e: any) => {
        setInputVal(e.target.value);
    }

    const Submit = async () => {
        if (inputVal == "") {
            setError("Please enter the password!");
        } else {
            let data = {convId: convId, password: inputVal}
            console.log(data);
            JoinChannel(() => null, router, data);
            // handle the case of wrong password later
        }

    }

    return (<>
        <motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                <div>
                    <h1 className={Styles.createChnl}>Password</h1>
                    <div><Image src={Cross} width={10} height={10} onClick={closePopup} /></div>
                </div>
                {error !== "" && <p className={Styles.errorMsg}>{ error }</p>}
                <form className={Styles.form} >
                    <input type="password" onChange={handleChange} className={Styles.usrsInpt}/>
                    <Button clickHandler={Submit} text="Join" />
                </form>
            </motion.div>
    </>)

}
