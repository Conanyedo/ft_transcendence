// Introducing in scope functions here
export const setMsg = (enteredMessage: string, e:React.KeyboardEvent<HTMLDivElement>, setChatMsgs: Function, chatMsgs:Array<Object>, setEnteredMsg: Function) => {

    let keycode:number = e.keyCode;

    if (keycode == 13) {
        setChatMsgs([...chatMsgs, { msgContent: enteredMessage, time: "07:19 PM", type: "sender", name: "You" }]);
        setEnteredMsg("");
    }
}

export function showConversation() {
    console.log("Show");
}

export const scrollToBottom = (messagesEndRef: HTMLDivElement) => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}