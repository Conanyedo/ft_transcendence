import Styles from "@styles/Chat/ChannelMember.module.css";
import ThreeDots from "@public/Chat/ThreeDots.svg";
import { SettingOption } from "./SettingOption";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MuteMember } from "./MuteMember";
import { member } from "@Types/dataTypes";
import { getImageBySize, useOutsideAlerter } from "@hooks/Functions";
import {
  fetchBanMember,
  fetchChangeMemberStatus,
  fetchUnmuteMmeber,
} from "@hooks/useFetchData";

interface Props {
  convId?: string;
  relation: string;
  role: string;
  member: member;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
}

export const ChannelMember: React.FC<Props> = ({
  convId,
  relation,
  role,
  member,
  setIsSuccess,
}) => {
  const [showChnlMemberSettings, setShowChnlMemberSettings] =
    useState<boolean>(false);
  const [showMuteMember, setShowMuteMember] = useState<boolean>(false);
  const refOption = useRef(null);
  const loggedInUsr = localStorage.getItem("owner");

  const dismissAdminClickHandler = async () => {
    console.log("Dismiss Admin ", member.login);
    if (convId) {
      if (
        await fetchChangeMemberStatus(
          { member: member.login, status: "Member" },
          convId
        )
      )
        setIsSuccess(true);
    }
  };

  const makeAdminClickHandler = async () => {
    console.log("Make admin : ", member.login);
    if (convId) {
      if (
        await fetchChangeMemberStatus(
          { member: member.login, status: "Admin" },
          convId
        )
      )
        setIsSuccess(true);
    }
  };

  const muteMemberClickHandler = () => {
    setShowMuteMember(true);
  };

  const unmuteMemberClickHandler = async () => {
    if (convId) {
      if (await fetchUnmuteMmeber({ member: member.login }, convId)) {
        console.log("Unmute Member");
        setIsSuccess(true);
      }
    }
  };

  const banMemberClickHandler = async () => {
    if (convId) {
      if (await fetchBanMember({ member: member.login }, convId)) {
        console.log("Remove Member");
        setIsSuccess(true);
      }
    }
  };

const chnlMemberSettingsClickHandler = () => {
    setShowChnlMemberSettings(!showChnlMemberSettings);
}

  const closeOptions = (v: boolean) => {
    setShowChnlMemberSettings(v);
  };

  useOutsideAlerter(refOption, closeOptions);

  return (
    <>
      {showMuteMember && (
        <MuteMember
          setShowMuteMember={setShowMuteMember}
          setIsSuccess={setIsSuccess}
          convId={convId}
          member={member}
        />
      )}
      <div className={Styles.ChannelMemberContainer}>
        <div className={Styles.ChannelMemberProfile}>
          <img src={getImageBySize(member.avatar, 70)} />
          {loggedInUsr === member.login ? "You" : member.fullname}
        </div>

        {(relation === "Owner" && role !== "Owners") ||
        (relation === "Admin" && (role === "Members" || role === "Muted")) ? (
          <div className={Styles.ChatMsgSettings}
                ref={refOption}>
            <img
              src={ThreeDots.src}
              onClick={chnlMemberSettingsClickHandler}
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
                  name="Ban member"
                  optionClickHandler={banMemberClickHandler}
                />
              </motion.div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};
