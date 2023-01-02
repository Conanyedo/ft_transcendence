import Styles from "@styles/Chat/InsertChannelMembers.module.css";
import CloseIcon from "@public/Chat/Cross.svg";
import { useState } from "react";
import { words } from "lodash";
import { composeWithDevTools } from "@reduxjs/toolkit/dist/devtoolsExtension";
import { current } from "@reduxjs/toolkit";

class friend {
  fullName: string = "";
  avatar: string = "";
}

const friends: friend[] = [
  {
    fullName: "Roronoa Zoro",
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
  },
  {
    fullName: "Sakazuki Akaino",
    avatar:
      "https://i.pinimg.com/originals/2e/94/a0/2e94a0d1a109f506d542decca10af75e.jpg",
  },
  {
    fullName: "Monkey D Luffy",
    avatar:
      "https://img.assinaja.com/upl/lojas/mundosinfinitos/imagens/foto-one-piece.png",
  },
  {
    fullName: "Kozuki Oden",
    avatar:
      "https://nintendoeverything.com/wp-content/uploads/OPPW4-DLC_12-10-20.jpg",
  },
];


export const InsertChannelMembers = () => {
  const [Search, setSearch] = useState<string>("");
  const [Members, setMembers] = useState<friend[]>([]);
  
  const Member = (user: friend) => {
    return (
      <div className={Styles.MemberContainer}>
        {user.fullName}
        <img src={CloseIcon.src} onClick={(e) => RemoveMemberHandler(user)}></img>
      </div>
    );
  };

  const SearchinputHandler = (event: any) => {
    setSearch(event.target.value);
  };
  
  const RemoveMemberHandler = (user : friend) => {
    setMembers(current => current.filter(Members => {
      return Members.fullName !== user.fullName
    }))
  };

  const AddMemberHandler = (user : friend) => {
    setMembers([...Members, user]);
  };

  return (
    <>
      <div className={Styles.InsertChnlMembersContainer}>
        {Members.map((user) => {
          return Member(user);
        })}
        <input
          type={"text"}
          name="channelMembers"
          // placeholder="Search"
          onChange={SearchinputHandler}
        ></input>
      </div>
      {Search && (
        <div className={Styles.UserList}>
          {friends.map((user: friend) => {
            if (user.fullName.toUpperCase().includes(Search.toUpperCase()))
            return (
              <>
              { !Members.includes(user) &&
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
              }
              </>
            );
          })}
        </div>
      )}
    </>
  );
};
