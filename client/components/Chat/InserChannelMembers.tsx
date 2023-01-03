import Styles from "@styles/Chat/InsertChannelMembers.module.css";
import CloseIcon from "@public/Chat/Cross.svg";
import { useState } from "react";
import { words } from "lodash";
import { composeWithDevTools } from "@reduxjs/toolkit/dist/devtoolsExtension";
import { current } from "@reduxjs/toolkit";
import Login from "@components/LoginPage/Login";

class friend {
  fullName: string = "";
  avatar: string = "";
  login: string = "";
}

const friends: friend[] = [
  {
    fullName: "Roronoa Zoro",
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    login: "zoro",
  },
  {
    fullName: "Sakazuki Akaino",
    avatar:
      "https://i.pinimg.com/originals/2e/94/a0/2e94a0d1a109f506d542decca10af75e.jpg",
    login: "akainu",
  },
  {
    fullName: "Monkey D Luffy",
    avatar:
      "https://img.assinaja.com/upl/lojas/mundosinfinitos/imagens/foto-one-piece.png",
    login: "luffy",
  },
  {
    fullName: "Kozuki Oden",
    avatar:
      "https://nintendoeverything.com/wp-content/uploads/OPPW4-DLC_12-10-20.jpg",
    login: "oden",
  },
];

const UsersList: React.FC<any> = (props) => {
  const AddMemberHandler = (user: friend) => {
    props.setMembers([...props.Members, user]);
  };
  

  return (
    <div className={Styles.UserList}>
      {friends.map((user: friend) => {
        if (user.fullName.toUpperCase().includes(props.Search.toUpperCase()))
          return (
            <>
              {!props.Members.includes(user) && (
                <div className={Styles.UserContainer}>
                  <div className={Styles.UserInfo}>
                    <img src={user.avatar}></img>
                    <p>{user.fullName}</p>
                  </div>
                  <div
                    className={Styles.AddUserBtn}
                    onClick={(e) => AddMemberHandler(user)}
                  >
                    Add
                  </div>
                </div>
              )}
            </>
          );
      })}
    </div>
  );
};

const Member: React.FC<any> = (props) => {
  return (
    <div className={Styles.MemberContainer}>
      {props.member.fullName}
      <img
        src={CloseIcon.src}
        onClick={(e) => props.removeMember(props.member)}
      ></img>
    </div>
  );
};

export const InsertChannelMembers = () => {
  const [Search, setSearch] = useState<string>("");
  const [Members, setMembers] = useState<friend[]>([]);

  const SearchinputHandler = (event: any) => {
    setSearch(event.target.value);
  };

  const RemoveMemberHandler = (user: friend) => {
    setMembers((current) =>
      current.filter((member) => {
        return member.fullName !== user.fullName;
      })
    );
  };

  return (
    <>
      <label htmlFor="inputAddMember">
        <div className={Styles.InsertChnlMembersContainer}>
          {Members.map((member) => {
            return (
              <Member
                removeMember={RemoveMemberHandler}
                member={member}
              />
            );
          })}
          <input
            id="inputAddMember"
            type={"text"}
            name="channelMembers"
            placeholder="Add User"
            onChange={SearchinputHandler}
          ></input>
        </div>
      </label>
      { <UsersList Members={Members} setMembers={setMembers} Search={Search}/>}
    </>
  );
};
