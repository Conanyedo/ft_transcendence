import Styles from "@styles/Chat/InsertChannelMembers.module.css";
import CloseIcon from "@public/Chat/Cross.svg";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { friend } from "@Types/dataTypes";
import { fetchDATA } from "@hooks/useFetchData";
import { useRouter } from "next/router";
import { getImageBySize } from "@hooks/Functions";

interface userListProps {
  members: friend[];
  friends: friend[];
  setMembers: Dispatch<SetStateAction<friend[]>>;
  Search: string;
}

const UsersList: React.FC<userListProps> = ({
  members,
  friends,
  setMembers,
  Search,
}) => {
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
              <div key={user.login} className={Styles.UserContainer}>
                <div className={Styles.UserInfo}>
                  <img src={getImageBySize(user.avatar, 70)} />
                  <p>{user.fullname}</p>
                </div>
                <div
                  className={Styles.AddUserBtn}
                  onClick={(e) => AddMemberHandler(user)}
                >
                  Add
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const Member: React.FC<{
  member: friend;
  removeMember: (user: friend) => void;
}> = ({ member, removeMember }) => {
  return (
    <div className={Styles.MemberContainer}>
      {member.fullname}
      <img src={CloseIcon.src} onClick={(e) => removeMember(member)} />
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
    console.log("onchange");
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
    fetchDATA(setFriendList, router, "friendship/friends");
  }, []);

  useEffect(() => {
    setSearch("");
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
            value={Search}
            name="channelMembers"
            placeholder="Add User"
            onChange={SearchinputHandler}
          ></input>
        </div>
      </label>
      {
        <UsersList
          friends={friendList}
          members={members}
          setMembers={setMembers}
          Search={Search}
        />
      }
    </>
  );
};
