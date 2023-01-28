import Styles from "@styles/Chat/InsertChannelMembers.module.css";
import CloseIcon from "@public/Chat/Cross.svg";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { friend, member } from "@Types/dataTypes";
import { fetchDATA } from "@hooks/useFetchData";
import { useRouter } from "next/router";
import { getImageBySize } from "@hooks/Functions";

interface userListProps {
  members: member[];
  friends: member[];
  setMembers: Dispatch<SetStateAction<member[]>>;
  Search: string;
  chnlMembers: string[];
}

const UsersList: React.FC<userListProps> = ({
  members,
  friends,
  setMembers,
  Search,
  chnlMembers,
}) => {
  const AddMemberHandler = (user: member) => {
    setMembers([...members, user]);
  };

  const filteredList: member[] = friends.filter(
    (user: member) =>
      !members.includes(user) &&
      !chnlMembers.includes(user.login) &&
      Search &&
      user.fullname.toUpperCase().includes(Search.toUpperCase())
  );

  return (
    <>
      {filteredList.length > 0 && (
        <div className={Styles.UserList}>
          {filteredList.map((user: member) => {
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
  member: member;
  removeMember: (user: member) => void;
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
  chnlMembers: string[];
}

export const InsertChannelMembers: React.FC<Props> = ({
  state,
  dispatch,
  chnlMembers,
}) => {
  const [Search, setSearch] = useState<string>("");
  const [friendList, setFriendList] = useState<member[]>([]);
  const [members, setMembers] = useState<member[]>([]);
  const router = useRouter();

  const SearchinputHandler = (event: any) => {
    setSearch(event.target.value);
  };

  const RemoveMemberHandler = (user: member) => {
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
          chnlMembers={chnlMembers}
          members={members}
          setMembers={setMembers}
          Search={Search}
        />
      }
    </>
  );
};
