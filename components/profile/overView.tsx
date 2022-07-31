import classes from '../../styles/overView.module.css';

import { useRef } from 'react';

const OverView = () => {

    return (
        <div className={classes.overview}>
            <div className={classes.titles}>
                <span className={classes.overviewTitle}>Overview</span>
                <span className={classes.friendsTitle}>Friends</span>
            </div>

            <div className={classes.overviewContent}>
                <div className={classes.leaderboard}>
                    <span className={classes.overviewTitle}>Leaderboard</span>
                    <div className={classes.leaderboardContent}>&nbsp;</div>
                </div>
                <div className={classes.stats}>
                    <span className={classes.overviewTitle}>Stats</span>
                    <div className={classes.statsContent}>&nbsp;</div>
                </div>
            </div>

            <div className={classes.friendsContent}>

            </div>

        </div>
    );
}

export default OverView;