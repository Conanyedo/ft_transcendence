import Styles from "@styles/chat.module.css"
import Cross from "@public/Cross.svg"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"
import _ from 'lodash';

// use datalist to show possible results 

function CustomToggleBtn(id: any) {

    return (
        <>
            <input type="checkbox" name={id.id} id={id.id} className={Styles.checkbox} />
            <label htmlFor={id.id} className={Styles.label}></label>
        </>)
}

function Option(props: { type: string }) {

    return (<>
        <div>
            <h3>{props.type}</h3>
            {/* toggle switch lies here */}
            <CustomToggleBtn id={props.type} />
        </div>
    </>)
}

export function ModalBox(props: { show: boolean, setShow: (Dispatch<SetStateAction<boolean>>) }): JSX.Element {
    return (<>
        <div style={{ display: props.show ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
        <div className={Styles.modalbox} style={{ display: props.show ? "block" : "none" }}>
            <div>
                <h1>Create channel</h1>
                <div><Image src={Cross} width={10} height={10} onClick={() => props.setShow(!props.show)} /></div>
            </div>

            <div>
                <span>Channel name</span>
                <input type="text" />
            </div>
            <div >
                <Option type="Public" />
                <Option type="Private" />
                <Option type="Protected" />
            </div>
            <p>Only users you invited can join the channel</p>
            <div>
                <span>Add Members</span>
                <input type="text" />
            </div>
            <button onClick={() => props.setShow(false)}>Create</button>
        </div>
    </>)
}