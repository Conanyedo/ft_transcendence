import Styles from "@styles/chat.module.css"
import Cross from "@public/Cross.svg"
import Image from "next/image"
import { Dispatch, SetStateAction, useRef, useContext } from "react"
import _ from 'lodash';
import { motion } from "framer-motion";
import { ChatContext, ChatContextType } from '@contexts/chatContext';

// use datalist to show possible results 

function CustomToggleBtn(id: any, refs: Array<HTMLDivElement>) {

    const { protectedChannel, setProtectedChannel } = useContext(ChatContext) as ChatContextType;

    const Ids = ["Private", "Public", "Protected"];
    const setChecked = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.id === "Protected") {
            setProtectedChannel(!protectedChannel);
        }

        let newIds = Ids.filter((id) => id !== event.target.id);
        newIds.forEach((id) => {
            let el: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
            el.checked = false;
        })
    }

    return (
        <>
            <input type="checkbox" name={id.id} id={id.id} className={Styles.checkbox} onChange={(event) => setChecked(event)} />
            <label htmlFor={id.id} className={Styles.label}></label>
        </>)
}

function Option(props: { type: string}) {

    return (<>
        <div>
            <h3>{props.type}</h3>
            {/* toggle switch lies here */}
            <CustomToggleBtn id={props.type} />
        </div>
    </>)
}

export function ModalBox(props: { show: boolean, setShow: (Dispatch<SetStateAction<boolean>>) }): JSX.Element {

    const { protectedChannel } = useContext(ChatContext) as ChatContextType;

    return (
        <>
            {props.show && <><div style={{ display: props.show ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
                <motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                    <div>
                        <h1>Create channel</h1>
                        <div><Image src={Cross} width={10} height={10} onClick={() => props.setShow(!props.show)} /></div>
                    </div>
                    <div>
                        <span>Channel name</span>
                        <input type="text" />
                    </div>
                    <div>
                        <Option type="Public" />
                        <Option type="Private" />
                        <Option type="Protected"/>
                    </div>
                    <p>All users can find and join this channel</p>
                    {protectedChannel && <div className={Styles.pwd}>
                        <span>Password</span>
                        <input type="password" />
                    </div>}
                    <div>
                        <span>Add Members</span>
                        <input type="text" />
                    </div>
                    <button onClick={() => props.setShow(false)}>Create</button>
                </motion.div>
            </>}
        </>)
}