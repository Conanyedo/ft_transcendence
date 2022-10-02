import { useEffect, useRef, useState } from "react";
import Styles from "@styles/chat.module.css"
import { MenuDropdown } from "./MenuDropdown";
import Image from "next/image";
import { MenuAsset } from "@svg/index";
import addUser from "@public/add-user.svg"
import { banMemberFromChannel, getChannelProfile } from "@hooks/useFetchData";
import menu from "@public/menu-asset.svg"
import Avatar from "@public/profile.jpg"
import { getImageBySize } from "@hooks/Functions";

const Header = (props: { setShowSetModal: any, status: string }) => {

    const statuses = ["Banned", "Muted", "Left"];

    return (<div className={Styles.profileHeader}>
        <h1>Channel Profile</h1>
        {!statuses.includes(props.status) && <button onClick={() => props.setShowSetModal(true)}><Image src={addUser} width={18} height={18} />Add Members</button>}
    </div>)
}

const setRights = (role: string, category: string) => {
    let categories = ["Member", "Admin", "Owner"];
    return (categories.indexOf(role) >= categories.indexOf(category));
}

const MenuElement = (props: { role: any, category: any, content: any, functions: any }) => {

    return (<MenuDropdown content={props.content} functions={props.functions} id={props.category} />)
}

function banMember(user: any, convId: any) {
    let data = { convId: convId, member: user.login };
    banMemberFromChannel(data);
    return (0);
}

function space() {
    return (0);
}

function upgradeMember(user: any, convId: any) {

    // return(0);
}

const changeContent = (role: any, category: any, setContent: any, setFunctions: any, setPermit: any, user: any, convId: string) => {

    const me = localStorage.getItem("owner");
    if (role == category && me == user?.login) {
        setContent([, "leave Channel"]);
        setFunctions([() => space(), () => banMember(user, convId)]);
    } else if (role == category && me != user?.login) {
        setContent([, "Remove Member"]);
        setFunctions([space(), banMember(user, convId)]);
    } else if (role != category && setRights(role, user.role) && role !== "Member") {
        setContent(["Upgrade Role", "Remove Member"]);
        setFunctions([() => upgradeMember(user, convId), () => banMember(user, convId)]);
    }
}

const Members = (props: { role: string, users: Array<Object>, category: string, convId: string }) => {

    const [dropdwn, setdropdwn] = useState(false);
    const setRefs: any = useRef([]);
    const [permit, setPermit] = useState(false);
    const [content, setContent] = useState<string[]>([]);
    const [functions, setFunctions] = useState<any>([]);

    const showElemDropdown = (e: any, user: any) => {

        const id = e.target.parentElement.parentElement.parentElement.id;
        if (!dropdwn) {
            setRefs.current[id].style = "display: block";
            const category = setRefs.current[id].firstChild.id;
            changeContent(props.role, category, setContent, setFunctions, setPermit, user, props.convId);
            setdropdwn(true);
        } else {
            setRefs.current[id].style = "display: none";
            setdropdwn(false);
        }
    }

    useEffect(() => {
        setPermit(setRights(props.role, props.category));
    }, [props.role, props.category]);

    useEffect(() => {
        console.log(props.users);
    }, [props.users]);

    useEffect(() => {
        // console.log(functions);
    }, [functions]);

    return (<>{(props?.users?.length !== 0) && <div className={Styles.members}>
        {props.category}
        {props?.users?.map((user: any, i: number) => (<div key={i}>
            <div className={Styles.membersAvtr}>
                <Image src={getImageBySize(user?.avatar, 70)} width={40} height={40} />
                <span>{user.fullname}</span>
            </div>
            <div id={i.toString()} onClick={(e: any) => showElemDropdown(e, user)} style={{ display: permit ? "block" : "none", cursor: "pointer" }}>
                <div><Image src={menu} width={6} height={30} /></div>
                <div style={{ display: "none" }} ref={element => setRefs.current[i] = element}><MenuElement role={props.role} category={props.category} content={content} functions={functions} /></div>
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
    let callback = (item: any) => { return (item.login == myLogin) };

    let dataArr = ObjToArray(data);

    dataArr.forEach(arr => {
        let result: any;
        if (arr.length !== 0) {
            result = arr.filter(callback);
            if (result.length !== 0) {
                setRole(result[0]?.status);
                return;
            }
        }

    })
}

export const Profile = (props: { setShowSetModal: any, convId: string, status: string }) => {

    const [data, setData] = useState<any>([]);
    const [role, setRole] = useState("");

    useEffect(() => {
        const getData = async () => {
            const value: any = await getChannelProfile(props.convId, setData);
            setData(value?.data);
            return;
        }
        getData();
    }, []);

    useEffect(() => {
        checkRole(data, setRole);
    }, [data, role]);

    return (<>
        <Header setShowSetModal={props.setShowSetModal} status={props.status} />
        {data.length !== 0 && (<><Members role={role} users={data.owner} key="Owner" category="Owner" convId={props.convId} />
            <Members role={role} users={data.admins} key="Admins" category="Admin" convId={props.convId} />
            <Members role={role} users={data.members} key="Members" category="Member" convId={props.convId} /></>)}
    </>)
}