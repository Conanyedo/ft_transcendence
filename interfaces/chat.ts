import { StaticImageData } from "next/image"

export interface chatUser {
	id: number;
	imgSrc: StaticImageData;
	firstName: string;
	lastName: string;
	status: string
  }

export interface chatMsg {
	msgContent: string | JSX.Element, 
	time: string, 
	type: string, 
	name: string
}

export interface color {
	color: string
}