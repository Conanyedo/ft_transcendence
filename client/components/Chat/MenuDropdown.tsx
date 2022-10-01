import Styles from "@styles/chat.module.css"


export const MenuDropdown = (props: { content: Array<any>, functions: Array<any>, id:string }) => {

    return (<div className={Styles.menuDropdown} id={props.id}>
        {props.content.map((element, i) => <div key={i} onClick={props.functions[i]} className={(i == 1) ? Styles.redText : ""}>{element}</div>)}
    </div>)
}
