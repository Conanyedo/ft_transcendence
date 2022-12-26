
import Styles from '../../styles/Chat/Conversation.module.css'

export const Conversation = () => {
    return (
        <div className={Styles.ConversationContainer}>
            <div className={Styles.Convinfo}>
                <img src='https://iamthepiratequeen.files.wordpress.com/2010/12/luffy.jpg'></img>
                <span>Username</span>
            </div>
            <div className={Styles.ConvStatus}>
            Status
            </div>
        </div>
    );
}