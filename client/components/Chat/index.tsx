import Styles from "@styles/chat.module.css"
import Image from "next/image"
import { GameIconAsset, ChannelAsset, BlueChannelAsset, MenuAsset, BackArrow } from "../../svg/index"
import { chatUser } from "@Types/dataTypes";
import { useContext, useState, useRef, useEffect } from "react";

import { getChannelProfile, leaveChannel, postChannel } from "@hooks/useFetchData";

// keep for later
// ${showCnv ? Styles.displayChat : ""}