import Styles from "@styles/Chat/ChatMessages.module.css";
import AddMembericon from "@public/Chat/AddMemberIcon.svg";
import { channelMembers, conversations } from "@Types/dataTypes";
import { useEffect, useState } from "react";
import { ChannelMember } from "./ChannelMember";
import { AddMembers } from "./AddMembers";
import { fetchChannelMembers } from "@hooks/useFetchData";

const initialMemberList: channelMembers = {
  owner: [],
  admins: [],
  members: [],
  muted: [],
};

export const ChatChnlProfile: React.FC<conversations> = (convData) => {
  const [showAddMember, setShowAddMember] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [chnlMemberList, setChnlMemberList] =
    useState<channelMembers>(initialMemberList);

  const AddMemberClickHandler = () => {
    console.log("Add Member clicked");
    setShowAddMember(true);
  };

  useEffect(() => {
    if (convData.convId)
      fetchChannelMembers(convData.convId, setChnlMemberList);
    return () => {
      setChnlMemberList(initialMemberList);
      setIsSuccess(false);
    };
  }, [convData.convId, isSuccess]);

  return (
    <>
      {showAddMember && <AddMembers setShowAddMember={setShowAddMember} />}
      <div className={Styles.ChannelProfile}>
        <div className={Styles.ChannelProfileHeader}>
          Channel Profile
          <div
            className={Styles.AddMemberButton}
            onClick={AddMemberClickHandler}
          >
            <img src={AddMembericon.src} alt="AddMemberIcon"></img>
            <p>Add members</p>
          </div>
        </div>
        {chnlMemberList.owner.length > 0 && (
          <div className={Styles.MemberListContainer}>
            Owner
            <div className={Styles.MemberList}>
              <ChannelMember
                convId={convData.convId}
                relation={convData.status}
                role={"Owners"}
                member={chnlMemberList.owner[0]}
                setIsSuccess={setIsSuccess}
              />
            </div>
          </div>
        )}
        {chnlMemberList.admins !== undefined &&
          chnlMemberList.admins.length > 0 && (
            <div className={Styles.MemberListContainer}>
              Admins
              <div className={Styles.MemberList}>
                {chnlMemberList.admins.map((member) => {
                  return (
                    <ChannelMember
                      key={member.login}
                      convId={convData.convId}
                      relation={convData.status}
                      role={"Admins"}
                      member={member}
                      setIsSuccess={setIsSuccess}
                    />
                  );
                })}
              </div>
            </div>
          )}
        {chnlMemberList.members !== undefined &&
          chnlMemberList.members.length > 0 && (
            <div className={Styles.MemberListContainer}>
              Members
              <div className={Styles.MemberList}>
                {chnlMemberList.members.map((member) => {
                  return (
                    <ChannelMember
                      key={member.login}
                      convId={convData.convId}
                      relation={convData.status}
                      role={"Members"}
                      member={member}
                      setIsSuccess={setIsSuccess}
                    />
                  );
                })}
              </div>
            </div>
          )}
        {chnlMemberList.muted !== undefined &&
          chnlMemberList.muted.length > 0 && (
            <div className={Styles.MemberListContainer}>
              Muted
              <div className={Styles.MemberList}>
                {chnlMemberList.muted.map((member) => {
                  return (
                    <ChannelMember
                      key={member.login}
                      convId={convData.convId}
                      relation={convData.status}
                      role={"Muted"}
                      member={member}
                      setIsSuccess={setIsSuccess}
                    />
                  );
                })}
              </div>
            </div>
          )}
      </div>
    </>
  );
};
