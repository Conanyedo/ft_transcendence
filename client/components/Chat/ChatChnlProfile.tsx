import Styles from "@styles/Chat/ChatMessages.module.css";
import { ChannelMember } from "./ChannelMember";
import AddMembericon from "@public/Chat/AddMemberIcon.svg";
import { conversations } from "@Types/dataTypes";
import { string } from "yup";
import { type } from "os";

export interface member {
  fullName: string;
  avatar: string;
  login: string;
}

export interface channelMembers {
  owner: member[];
  admins: member[];
  members: member[];
  mute: member[];
}

const chnlMemberList = {
  owner: [
    {
      fullName: "abdellah",
      avatar:
        "https://img.assinaja.com/upl/lojas/mundosinfinitos/imagens/foto-one-piece.png",
      login: "abbelhac",
    },
  ],
  admins: [
    {
      fullName: "Choiab Aboulewafa",
      avatar: "https://i.ytimg.com/vi/oZuzXz8tuSY/maxresdefault.jpg",
      login: "cabouelw",
    },
  ],
  members: [
    {
      fullName: "Hatim Mzah",
      avatar: "https://i.ytimg.com/vi/oZuzXz8tuSY/maxresdefault.jpg",
      login: "mza7a",
    },
    {
      fullName: "Ismail Mannoucha",
      avatar: "https://i.ytimg.com/vi/oZuzXz8tuSY/maxresdefault.jpg",
      login: "imannouc",
    },
    {
      fullName: "Othmane bounri",
      avatar: "https://i.ytimg.com/vi/oZuzXz8tuSY/maxresdefault.jpg",
      login: "obounri",
    },
    {
      fullName: "Amine El haiba",
      avatar: "https://i.ytimg.com/vi/oZuzXz8tuSY/maxresdefault.jpg",
      login: "aelhaiba",
    },
  ],
  mute: [
    {
      fullName: "Othmane bounri",
      avatar: "https://i.ytimg.com/vi/oZuzXz8tuSY/maxresdefault.jpg",
      login: "obounri",
    },
    {
      fullName: "Amine El haiba",
      avatar: "https://i.ytimg.com/vi/oZuzXz8tuSY/maxresdefault.jpg",
      login: "aelhaiba",
    },
  ],
};

export const ChatChnlProfile: React.FC<conversations> = (convData) => {
  // const loggedInUsr = localStorage.getItem("owner");

  const AddMemberClickHandler = () => {
    console.log("Add Member clicked");
  };

  console.log("convData Chnl : ", convData.relation);

  return (
    <>
      <div className={Styles.ChannelProfile}>
        <div className={Styles.ChannelProfileHeader}>
          Channel Profile
          <div
            className={Styles.AddMemberButton}
            onClick={AddMemberClickHandler}
          >
            <img src={AddMembericon.src} alt="AddMemberIcon"></img>
            <p>Add member</p>
          </div>
        </div>
        {chnlMemberList.owner && (
          <div className={Styles.MemberListContainer}>
            Owner
            <div className={Styles.MemberList}>
              <ChannelMember
                relation={convData.relation}
                role={"Owners"}
                member={chnlMemberList.owner[0]}
              />
            </div>
          </div>
        )}
        {chnlMemberList.admins && (
          <div className={Styles.MemberListContainer}>
            Admins
            <div className={Styles.MemberList}>
              {chnlMemberList.admins.map((member) => {
                return (
                  <ChannelMember
                    key={member.login}
                    relation={convData.relation}
                    role={"Admins"}
                    member={member}
                  />
                );
              })}
            </div>
          </div>
        )}
        <div className={Styles.MemberListContainer}>
          Members
          <div className={Styles.MemberList}>
            {chnlMemberList.members.map((member) => {
              return (
                <ChannelMember
                  key={member.login}
                  relation={convData.relation}
                  role={"Admins"}
                  member={member}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
