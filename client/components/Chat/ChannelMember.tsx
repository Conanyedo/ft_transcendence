import Styles from '@styles/Chat/ChannelMember.module.css';
import ThreeDots from '@public/Chat/ThreeDots.svg';
import { SettingOption } from './SettingOption';
import { useState } from 'react';
import { channelMembers, member } from './ChatChnlProfile';

export const ChannelMember = (props : {relation : string, role : string, member : member}) => {
    const [showChnlMemberSettings, setShowChnlMemberSettings] = useState<boolean>(false);
    const loggedInUsr = localStorage.getItem("owner");

    const MemberSettingClickHandler = () => {
        console.log('Member setting ');
    };

    console.log("relation member :", props.relation);
    // console.log("role member :", props.role);
    // console.log("member :", props.member);
    return (
        <>
            <div className={Styles.ChannelMemberContainer}>
                <div className={Styles.ChannelMemberProfile}>
                    <img src={props.member.avatar}></img>
                    {(loggedInUsr === props.member.login) ? "You" : props.member.fullName}
                </div>
                {/* { (props.relation === "Owner" || props.relation === "Admin") && */}
                    <img src={ThreeDots.src} onClick={() => setShowChnlMemberSettings(!showChnlMemberSettings)}/>
                {showChnlMemberSettings && (
              <div className={Styles.SettingContainer}>
                {props.relation === "Owner" ||
                props.relation === "Admin" ? (
                  <SettingOption name={"Settings"} optionClickHandler={() => console.log("clicked opt")}/>
                ) : null}
              </div>
            )}
            </div>
        </>
    );
};