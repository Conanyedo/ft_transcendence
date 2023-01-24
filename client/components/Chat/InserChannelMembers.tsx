import Styles from "@styles/Chat/InsertChannelMembers.module.css";
import CloseIcon from "@public/Chat/Cross.svg";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { friend } from "@Types/dataTypes";
import { fetchDATA } from "@hooks/useFetchData";
import { useRouter } from "next/router";

const friends: friend[] = [
  {
    fullname: "Roronoa Zoro",
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    login: "zoro",
    status: "Online",
  },
  {
    fullname: "Sakazuki Akaino",
    avatar:
      "https://i.pinimg.com/originals/2e/94/a0/2e94a0d1a109f506d542decca10af75e.jpg",
    login: "akainu",
    status: "Online",
  },
  {
    fullname: "Monkey D Luffy",
    avatar:
      "https://img.assinaja.com/upl/lojas/mundosinfinitos/imagens/foto-one-piece.png",
    login: "luffy",
    status: "Online",
  },
  {
    fullname: "Kozuki Oden",
    avatar:
      "https://nintendoeverything.com/wp-content/uploads/OPPW4-DLC_12-10-20.jpg",
    login: "oden",
    status: "Online",
  },
];

interface userListProps {
  members : friend[];
  friends : friend[];
  setMembers : Dispatch<SetStateAction<friend[]>>;
  Search : string;
}

const UsersList: React.FC<userListProps> = ({members, friends, setMembers, Search}) => {
  const AddMemberHandler = (user: friend) => {
    setMembers([...members, user]);
  };

  const filteredList: friend[] = friends.filter((user: friend) => {
    return (
      !members.includes(user) &&
      Search &&
      user.fullname.toUpperCase().includes(Search.toUpperCase())
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
                      <p>{user.fullname}</p>
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
      {props.member.fullname}
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
  const [friendList, setFriendList] = useState<friend[]>([]);
  const [members, setMembers] = useState<friend[]>([]);
  const router = useRouter();

  const SearchinputHandler = (event: any) => {
    setSearch(event.target.value);
  };

  const RemoveMemberHandler = (user: friend) => {
    setMembers((current) =>
      current.filter((member) => {
        return member.fullname !== user.fullname;
      })
    );
  };

  useEffect(() => {
    const newMembers = members.map((user) => user.login);
    dispatch({ type: "members", members: newMembers });
  }, [members]);

  useEffect(() => {
    fetchDATA(setFriendList, router, "friendship/friends");
  },[]);

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
      {<UsersList friends={friendList} members={members} setMembers={setMembers} Search={Search} />}
    </>
  );
};
