import Styles from "@styles/chat.module.css"
import addUser from "@public/add-user.svg"
import Image from "next/image"
import Avatar from "@public/profile.jpg";
import { MenuAsset } from "./svg/index"

const Members = (props: { role: string, users: Array<Object> }) => {
    return (<div className={Styles.members}>
        {props.role}
        {props.users.map((user: any) => (<div>
            <div className={Styles.membersAvtr}>
                <Image src={user.avatar} width={40} height={40} />
                <span>{user.fullName}</span>
            </div>
            <MenuAsset />
        </div>))}
    </div>)
}

const Header = () => {
    return (<div className={Styles.settingsHeader}>
        <h1>Channel Profile</h1>
        <button><Image src={addUser} width={18} height={18} />Add Member</button>
    </div>)
}

export const Profile = () => {

    const owners = [{ fullName: "Ikram Kharbouch", avatar: Avatar }];
    const admins = [{ fullName: "Abdellah Belhachmi", avatar: Avatar }, { fullName: "Youness Bouddou", avatar: Avatar }]
    const members = [{ fullName: "Abdellah Belhachmi", avatar: Avatar }, { fullName: "Youness Bouddou", avatar: Avatar }, { fullName: "choaib abouelwafa", avatar: Avatar }, { fullName: "nounou lhilwa", avatar: Avatar }];

    return (<>
        <Header />
        <Members role="Owner" users={owners} />
        <Members role="Admins" users={admins} />
        <Members role="Members" users={members} />
    </>)
}