import Styles from "styles/Chat/MessagesList.module.css"
import { conversations, MsgData } from "@Types/dataTypes"
import { useState, useEffect, useRef } from "react"
import { ChatMessageInput } from "./ChatMessageInput"
import socket_notif from "config/socketNotif"
import socket_game from "config/socketGameConfig"
import { useRouter } from "next/router"
import { getImageBySize } from "@hooks/Functions"

const formatAMPM = (date: Date) => {
	let hours = new Date(date).getHours()
	let minutes: number | string = new Date(date).getMinutes()
	const ampm = hours >= 12 ? "PM" : "AM"

	hours %= 12
	hours = hours || 12
	minutes = minutes < 10 ? `0${minutes}` : minutes

	const strTime = `${hours}:${minutes} ${ampm}`
	return strTime
}
interface MsgProps {
	avatar?: string
	msg: string
	sender: string
	fullname?: string
	invitation?: string
	status: string
	date: Date
	convId?: string
	msgId?: string
	type: string
	UpdateInvitMsg: (msgId: string, status: string) => void
}

const Message: React.FC<MsgProps> = ({
	avatar,
	msg,
	sender,
	fullname,
	invitation,
	status,
	type,
	date,
	msgId,
	convId,
	UpdateInvitMsg,
}) => {
	const msgTime = formatAMPM(date)
	const me = localStorage.getItem("owner")
	const MsgInvitStatus = `${
		status === "Canceled"
			? "Invitation has been canceled"
			: status === "Accepted"
			? "Invitation has been accepted"
			: status === "Refused"
			? "Invitation has been refused"
			: sender === me
			? "You invite him to play pong game"
			: "Invites you to play pong game"
	}`
	const router = useRouter()
	const NewPath = getImageBySize(avatar?.length ? avatar : "", 70)

	const AcceptInviteHandler = async () => {
		socket_game.emit("joinGameFriend", { login: me, accept: invitation }, (data: string) => {
			if (data.length > 4 && msgId && convId) {
				socket_notif.emit(
					"updateInvitation",
					{
						convId: convId,
						msgId: msgId,
						status: "Accepted",
					},
					(res: any) => {
						UpdateInvitMsg(msgId, "Accepted")
						router.push("/game/lobby?gameID=" + data)
					}
				)
			}
		})
	}

	const RefuseInviteHandler = async () => {
		socket_game.emit("refuseChallenge", invitation)
		if (msgId && convId)
			socket_notif.emit("updateInvitation", { convId: convId, msgId: msgId, status: "Refused" }, (res: any) => {
				UpdateInvitMsg(msgId, "Refused")
			})
	}
	const CancelInviteHandler = () => {
		console.log("msgId:", msgId, convId)
		socket_game.emit("removeGameLobby", invitation)
		if (msgId && convId)
			socket_notif.emit("updateInvitation", { convId: convId, msgId: msgId, status: "Canceled" }, (res: any) => {
				UpdateInvitMsg(msgId, "Canceled")
			})
	}

	return (
		<>
			{!invitation ? (
				<div className={sender === me ? Styles.right : Styles.left}>
					<div className={Styles.MsgContainer}>
						<div className={`${Styles.MsgBox} ${sender !== me && Styles.SenderMsgBox}`}>
							{type !== "Dm" && sender !== me ? <h2>{fullname}</h2> : null}
							<p>{msg}</p>
						</div>
						<div className={`${Styles.MsgDate} ${sender !== me && Styles.SenderMsgDate}`}>{msgTime}</div>
					</div>
				</div>
			) : (
				<div className={sender === me ? Styles.right : Styles.left}>
					<div className={Styles.MsgContainer}>
						<div className={`${Styles.InviteMsgBox} && ${sender !== me && Styles.SenderInviteMsgBox}`}>
							<div className={Styles.InviteMsginfo}>
								<img src={NewPath} alt={fullname}></img>
								<div className={Styles.InviteMsgProfile}>
									<div>
										<div className={Styles.InviteMsgProfileName}>{fullname}</div>
										<div className={Styles.InviteMsgStatus}>{MsgInvitStatus}</div>
									</div>
								</div>
							</div>
							{sender === me && status === "Sent" ? (
								<div className={Styles.InviteMsgButton} onClick={CancelInviteHandler}>
									Cancel invitation
								</div>
							) : status === "Sent" ? (
								<div className={Styles.SenderInviteMsgButton}>
									<div className={Styles.RefuseInvite} onClick={RefuseInviteHandler}>
										Refuse
									</div>
									<div className={Styles.AcceptInvite} onClick={AcceptInviteHandler}>
										Accept
									</div>
								</div>
							) : null}
						</div>
						<div className={`${Styles.MsgDate} ${sender !== me && Styles.SenderMsgDate}`}>{msgTime}</div>
					</div>
				</div>
			)}
		</>
	)
}

interface MsglistProps {
	convData: conversations
	updateConversations: (msgConvId: string) => void
}

export const MessagesList: React.FC<MsglistProps> = ({ convData, updateConversations }) => {
	const [chatMessages, setChatMessages] = useState<MsgData[]>([])
	const MessageRef = useRef<null | HTMLDivElement>(null)

	/* -------------------------------------------------------------------------- */
	/*                             fetch Messages List                            */
	/* -------------------------------------------------------------------------- */

	useEffect(() => {
		socket_notif.emit("getMsgs", { convId: convData.convId }, (response: any) => {
			setChatMessages(response.data)
		})
		return () => {}
	}, [convData.convId])

	/* -------------------------------------------------------------------------- */
	/*                              listen on new msg                             */
	/* -------------------------------------------------------------------------- */

	useEffect(() => {
		socket_notif.on("newMsg", (response: any) => {
			{
				if (response.data.convId === convData.convId) {
					setChatMessages((previous) => [...previous, response.data])
				}
				updateConversations(response.data.convId)
			}
		})
		return () => {
			socket_notif.off("newMsg")
		}
	}, [convData])

	useEffect(() => {
		MessageRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [chatMessages, convData])

	const UpdateInvitMsg = (msgId: string, status: string) => {
		let msgs: MsgData[] = []
		chatMessages.map((msg) => {
			if (msg.msgId === msgId) {
				msg.status = status
			}
			msgs.push(msg)
		})
		setChatMessages(msgs)
	}
	// console.log("jadid: ", chatMessages, chatMessages[0]?.convId)

	return (
		<>
			<div className={Styles.ChatMsgList}>
				{chatMessages.map((msg) => {
					return (
						<Message
							key={msg.msgId}
							{...msg}
							avatar={msg.invitation ? convData.avatar : undefined}
							type={convData.type}
							UpdateInvitMsg={UpdateInvitMsg}
						/>
					)
				})}
				<div ref={MessageRef} />
			</div>
			<ChatMessageInput convData={convData} />
		</>
	)
}
