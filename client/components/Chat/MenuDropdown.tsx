import Styles from "@styles/chat.module.css"


export const MenuDropdown = (props: { content: Array<any>, functions: Array<any> }) => {

    return (<div className={Styles.menuDropdown}>
        {props.content.map((element, i) => <div key={i} onClick={props.functions[i]} className={(i == 1) ? Styles.redText : ""}>{element}</div>)}
    </div>)
}
