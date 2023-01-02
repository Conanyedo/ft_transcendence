import Styles from '@styles/Chat/ChannelMember.module.css';
import ThreeDots from '@public/Chat/ThreeDots.svg';

export const ChannelMember = () => {
    const MemberSettingClickHandler = () => {
        console.log('Member setting ');
    };

    return (
        <>
            <div className={Styles.ChannelMemberContainer}>
                <div className={Styles.ChannelMemberProfile}>
                    <img src='https://i.pinimg.com/736x/65/23/43/652343e839c6621c1c4739b89c218948.jpg'></img>
                    Roronoa Zoro
                </div>
                <img src={ThreeDots.src} onClick={MemberSettingClickHandler}></img>
            </div>
        </>
    );
};