import React, { useState } from "react";

class userType {
    Id: number;
    Name: string;
    Status: string;
    Lvl: number;
    GP: number;
    Rank: number;
    Tier: string;
    FriendListID: number[];
    AchievementsID: number[];
    MatchHistoryID: number[];

    constructor(name:string) {
        this.Id = Math.floor(Math.random() * 10000);
        this.Name = name;
        this.Status = 'Online';
        this.Lvl = 0;
        this.GP = 0;
        this.Rank = 0;
        this.Tier = 'Unranked';
        this.FriendListID = [0];
        this.AchievementsID = [0];
        this.MatchHistoryID = [0];
    }
}

type dataUsers ={
	users: userType[];
	addUser: (text: string) => void;
	unfriendUser: (id: string) => void;
};

const UserContextProvider= (props: any) => {

	const [todoItems, setTodoItems] = useState<userType>();

	const AddUser = (name:string) => {
		const newtodo = new userType(name);
		setTodoItems(newtodo);
	};

    // const AddFriend = (id: string) => {
	// 	setTodoItems(prev => prev.filter(item => item.id !== id));
	// };

	// const Unfriend = (id: string) => {
	// 	setTodoItems(prev => prev.filter(item => item.id !== id));
	// };

	// const contextValue: todoContextObj = {
	// 	items: todoItems,
	// 	addTodo: AddTodoHandler,
	// 	removeTodo: RemoveHandler
	// };

	// return (<TodoContext.Provider value={contextValue}>
	// 	{props.children}
	// </TodoContext.Provider>);
}

export default UserContextProvider;