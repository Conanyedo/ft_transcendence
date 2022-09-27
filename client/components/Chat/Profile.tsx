import { useEffect, useRef, useState } from "react";
import Styles from "@styles/chat.module.css"
import { MenuDropdown } from "./MenuDropdown";
import Image from "next/image";
import { MenuAsset } from "@svg/index";
import addUser from "@public/add-user.svg"
import { getChannelProfile } from "@hooks/useFetchData";
import Avatar from "@public/profile.jpg"

const Header = (props: { setShowSetModal: any }) => {
    return (<div className={Styles.profileHeader}>
        <h1>Channel Profile</h1>
        <button onClick={() => props.setShowSetModal(true)}><Image src={addUser} width={18} height={18} />Add Members</button>
    </div>)
}


const Members = (props: { role: string, users: Array<Object> }) => {

    const [dropdwn, setdropdwn] = useState(false);

    const setRefs: any = useRef([]);
    const MenuElement = () => {
        return (<MenuDropdown content={["Dismiss Admin", "Remove Member"]} functions={[() => console.log("test"), () => console.log("test")]} />)
    }

    useEffect(() => {
        console.log(props.users);
    }, [])

    // {dropdwn && menus.map((Element:any, i:any) => <div key={i} ref={element => setRefs.current[i] = element}><Element /></div>)}

    return (<>{(props.users?.length !== 0) && <div className={Styles.members}>
        {props.role}
        {props.users?.map((user: any, i: number) => (<div key={i}>
            <div className={Styles.membersAvtr}>
                <Image src={user.avatar} width={40} height={40} />
                <span>{user.fullname}</span>
            </div>
            <div onClick={() => setdropdwn(!dropdwn)}>
                <MenuAsset />
                <div style={{ display: dropdwn ? "block" : "none" }} ref={element => setRefs.current[i] = element}><MenuElement /></div>
            </div>
        </div>))}
    </div>}</>

    )
}

export const Profile = (props: { setShowSetModal: any, convId: any }) => {

    const [data, setData] = useState<any>([]);

    useEffect(() => {
        const getData = async () => {
            const value: any = await getChannelProfile(props.convId, setData);
            console.log(value.data.owner);
            setData(value.data);
            return;
        }

        getData();
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data])

    const owners = [{ name: "Ikram Kharbouch", avatar: Avatar }];
    const admins = [{ name: "Youness Bouddou", avatar: Avatar }, { name: "Youness Bouddou", avatar: Avatar }]
    const members = [{ name: "Youness Bouddou", avatar: Avatar }, { name: "Youness Bouddou", avatar: Avatar }, { name: "choaib abouelwafa", avatar: Avatar }, { name: "nounou lhilwa", avatar: Avatar }];

    return (<>
        <Header setShowSetModal={props.setShowSetModal} />
        <Members role="Owner" users={data.owner} key="Owner" />
        <Members role="Admins" users={data.admins} key="Admins" />
        <Members role="Members" users={data.members} key="Members" />
    </>)
}