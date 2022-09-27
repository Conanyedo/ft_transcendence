import { ChatContext, ChatContextType } from "@contexts/chatContext";
import { postChannel } from "@hooks/useFetchData";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Styles from "@styles/chat.module.css"
import { ModalBox } from "@components/Modal";
import { ChannelAsset, BlueChannelAsset } from "@svg/index";
import Image from "next/image";
import { filterChatUsers } from "@utils/chat";
import Link from "next/link";
import Search from "@public/Icon.svg";


export const ChatLeft = (props: { login: any }) => {

    // Setting some local state
    const { lastUsers, setShowCnv, showCnv, setLastUsers, chatUsersRefs, initialusrData } = useContext(ChatContext) as ChatContextType;
    const [show, setShow] = useState<boolean>(false);
    const [displayBlueIcon, setDisplayBlueIcon] = useState(false);

    const [channelDetails, setChannelDetails] = useState<any>();

    const router = useRouter();

    // functions
    async function createChannel(channelName: string, convType: string, password: string, members: Array<string>, setUsrTags: any, formik: any) {

        setShow(!show);

        let loginList = lastUsers.filter((item, i) => item.name == members[i]).map((item) => item.login);
        const data = { name: channelName, type: convType, members: loginList, password: password };

        // send data to channel create route here

        postChannel(setChannelDetails, router, data)

        // reset the users here
        // setLastUsers([channelDetails, ...lastUsers]);

        // select the current chat
        // setChatUser(lastUsers[0], setShowCnv);

        // reset the necessary fields
        formik.setFieldValue("cName", "");
        formik.setFieldValue("password", "");
        formik.setFieldValue("member", "");
        setUsrTags([]);
    }

    useEffect(() => {

        console.log(props.login)
        if (props.login != undefined)
            setShowCnv(true);

    }, [])

    useEffect(() => {
        console.log(lastUsers);
    }, [lastUsers])

    return (<>
        <div className={`${Styles.chatLeft} ${showCnv ? Styles.hideUsers : ""}`}>
            <div className={Styles.leftContent}>
                <div className={Styles.topSection}>
                    <div className={Styles.msg}>Message</div>
                    {!displayBlueIcon && <div onClick={() => setShow(!show)} className={Styles.channel} onMouseOver={() => setDisplayBlueIcon(true)}><ChannelAsset color="#758293" /></div>}
                    {displayBlueIcon && <div onMouseLeave={() => setDisplayBlueIcon(false)} className={Styles.channel} onClick={() => setShow(!show)}><BlueChannelAsset /></div>}
                    <ModalBox show={show} setShow={setShow} createChannel={createChannel} />
                </div>
                <div className={Styles.chatSearch}>
                    <Image src={Search} width={20} height={20} />
                    <input type="Text" className={Styles.chatInput} placeholder="Search" onChange={(e) => filterChatUsers(e, lastUsers, setLastUsers, initialusrData)} />
                </div>
                <div className={Styles.bottomSection}>
                    {lastUsers.map((user: any, i: any) => <Link href={"/chat?login=" + user.login} key={i}><div key={i} ref={(element) => { chatUsersRefs.current[parseInt(i)] = element }} className={Styles.chatUser}>
                        <div className={Styles.avatarName}>
                            <div className={Styles.avatar}><img src={user?.avatar} /></div>
                            <div className={Styles.username}>{user.name} {user.channelname}</div>
                        </div>
                        <p className={Styles.status}>{user?.membersNum ? user?.membersNum + " members" : user.status}</p>
                    </div></Link>)}
                    {(lastUsers.length == 0) && <div className={Styles.newCnv}>No conversations yet</div>}
                </div>
            </div>
        </div>
    </>)
}