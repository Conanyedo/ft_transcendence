import Styles from "@styles/Chat/InsertChannelMembers.module.css";
import CloseIcon from "@public/Chat/Cross.svg";
import { useEffect, useState } from "react";

class friend {
  avatar: string = "";
  fullName: string = "";
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
    props.setMembers([...props.members, user]);
  };

  const filteredList: friend[] = friends.filter((user: friend) => {
    return (
      !props.members.includes(user) &&
      props.Search &&
      user.fullName.toUpperCase().includes(props.Search.toUpperCase())
    );
  });

  return (
    <>
      {filteredList.length > 0 && (
        <div className={Styles.UserList}>
          {filteredList.map((user: friend) => {
            return (
              <>
                {
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

interface Props {
  state: any;
  dispatch: (action: any) => void;
}

export const InsertChannelMembers: React.FC<Props> = ({ state, dispatch }) => {
  const [Search, setSearch] = useState<string>("");
  const [members, setMembers] = useState<friend[]>([]);

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

  useEffect(() => {
    const newMembers = members.map((user) => user.login);
    dispatch({ type: "members", members: newMembers });
  }, [members]);

  return (
    <>
      <label htmlFor="inputAddMember">
        <div className={Styles.InsertChnlMembersContainer}>
          {members.map((member) => {
            return (
              <Member
                key={member.login}
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
      {<UsersList members={members} setMembers={setMembers} Search={Search} />}
    </>
  );
};
