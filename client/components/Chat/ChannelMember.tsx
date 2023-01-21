import Styles from "@styles/Chat/ChannelMember.module.css";
import ThreeDots from "@public/Chat/ThreeDots.svg";
import { SettingOption } from "./SettingOption";
import { useState } from "react";
import { motion } from "framer-motion";
import { MuteMember } from "./MuteMember";
import { member } from "@Types/dataTypes";
interface Props {
  relation: string;
  role: string;
  member: member;
}

export const ChannelMember: React.FC<Props> = ({ relation, role, member }) => {
  const [showChnlMemberSettings, setShowChnlMemberSettings] =
    useState<boolean>(false);
  const [showMuteMember, setShowMuteMember] = useState<boolean>(false);
  const loggedInUsr = localStorage.getItem("owner");

  const dismissAdminClickHandler = () => {
    console.log("Dismiss Admin ");
  };

  const makeAdminClickHandler = () => {
    console.log("Make admin");
  };

  const muteMemberClickHandler = () => {
    console.log("Mute Member");
    setShowMuteMember(true);
  };

  const unmuteMemberClickHandler = () => {
    console.log("Unmute Member");
  };

  const removeMemberClickHandler = () => {
    console.log("Remove Member");
  };

  return (
    <>
      {showMuteMember && <MuteMember setShowMuteMember={setShowMuteMember}/>}
      <div className={Styles.ChannelMemberContainer}>
        <div className={Styles.ChannelMemberProfile}>
          <img src={member.avatar}></img>
          {loggedInUsr === member.login ? "You" : member.fullname}
        </div>

        {(relation === "Owner" && role !== "Owners") ||
        (relation === "Admin" && (role === "Members" || role === "Muted")) ? (
          <div className={Styles.ChatMsgSettings}>
            <img
              src={ThreeDots.src}
              onClick={() => setShowChnlMemberSettings(!showChnlMemberSettings)}
            />
            {showChnlMemberSettings && (
              <motion.div
                className={Styles.SettingContainer}
                initial={{
                  opacity: 0,
                  scale: 0.1,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
              >
                {role === "Admins" ? (
                  <SettingOption
                    name={"Dismiss admin"}
                    optionClickHandler={dismissAdminClickHandler}
                  />
                ) : role !== "Muted" ? (
                  <>
                    <SettingOption
                      name="Mute member"
                      optionClickHandler={muteMemberClickHandler}
                    />
                    <SettingOption
                      name="Make as admin"
                      optionClickHandler={makeAdminClickHandler}
                    />
                  </>
                ) : (
                  <SettingOption
                    name="Unmute member"
                    optionClickHandler={unmuteMemberClickHandler}
                  />
                )}
                <SettingOption
                  name="Remove member"
                  optionClickHandler={removeMemberClickHandler}
                />
              </motion.div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};
