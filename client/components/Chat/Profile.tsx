import { useEffect, useRef, useState } from "react";
import Styles from "@styles/chat.module.css"
import { MenuDropdown } from "./MenuDropdown";
import Image from "next/image";
import { MenuAsset } from "@svg/index";
import addUser from "@public/add-user.svg"
import { getChannelProfile } from "@hooks/useFetchData";
import menu from "@public/menu-asset.svg"
import Avatar from "@public/profile.jpg"

const Header = (props: { setShowSetModal: any }) => {
    return (<div className={Styles.profileHeader}>
        <h1>Channel Profile</h1>
        <button onClick={() => props.setShowSetModal(true)}><Image src={addUser} width={18} height={18} />Add Members</button>
    </div>)
}

const MenuElement = () => {
    return (<MenuDropdown content={["Dismiss Admin", "Remove Member"]} functions={[() => console.log("test"), () => console.log("test")]} />)
}

const setRights = (role: string, category: string) => {
    let categories = ["Member", "Admin", "Owner"];
    return (categories.indexOf(role) >= categories.indexOf(category));
}

const Members = (props: { role: string, users: Array<Object>, category: string }) => {

    const [dropdwn, setdropdwn] = useState(false);

    const setRefs: any = useRef([]);
    const [permit, setPermit] = useState(false);
    
    const showElemDropdown = (e: any) => {
        const id = e.target.parentElement.parentElement.parentElement.id;
        if (!dropdwn) {
            setRefs.current[id].style = "display: block";
            setdropdwn(true);
        } else {
            setRefs.current[id].style = "display: none";
            setdropdwn(false);
        }
    }

    useEffect(() => {
        setPermit(setRights(props.role, props.category));
    }, [props.role, props.category])

    const imgSrc: any = MenuAsset();

    return (<>{(props.users?.length !== 0) && <div className={Styles.members}>
        {props.category}
        {props.users?.map((user: any, i: number) => (<div key={i}>
            <div className={Styles.membersAvtr}>
                <Image src={user?.avatar} width={40} height={40} />
                <span>{user.fullname}</span>
            </div>
            <div id={i.toString()} onClick={showElemDropdown} style={{ display: permit ? "block" : "none"}}>
                <div><Image src={menu} width={6} height={30} /></div>
                <div style={{ display: "none" }} ref={element => setRefs.current[i] = element}><MenuElement /></div>
            </div>
        </div>))}
    </div>}</>

    )
}

function ObjToArray(data: any) {
    var outputData = [];
    for (var i in data) {
        outputData.push(data[i]);
    }
    return outputData;
}

function checkRole(data: any, setRole: any) {
    let myLogin: any = localStorage.getItem("owner");
    let callback = (item: any) => { return (item.login == myLogin) } ;

    let dataArr = ObjToArray(data);

    dataArr.forEach(arr => {
        let result: any;
        if (arr.length !== 0) {
            result = arr.filter(callback);
            if (result.length !== 0)
            {
                setRole(result[0]?.status);
                return;
            }
        }
            
    })
}

export const Profile = (props: { setShowSetModal: any, convId: any }) => {

    const [data, setData] = useState<any>([]);
    const [role, setRole] = useState("");

    useEffect(() => {
        const getData = async () => {
            const value: any = await getChannelProfile(props.convId, setData);
            console.log(value?.data?.owner);
            setData(value?.data);
            return;
        }

        getData();
    }, []);

    useEffect(() => {
        checkRole(data, setRole);
    }, [data, role])

    return (<>
        <Header setShowSetModal={props.setShowSetModal} />
        <Members role={role} users={data.owner} key="Owner" category="Owner" />
        <Members role={role} users={data.admins} key="Admins" category="Admin"/>
        <Members role={role} users={data.members} key="Members" category="Member"/>
    </>)
}