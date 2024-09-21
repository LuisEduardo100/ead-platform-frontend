import { makeStyles, Slider, styled, Button, IconButton, Tooltip, Popover, Grid2 } from "@mui/material";
import styles from './styles.module.scss'
import {
    Forward10,
    Replay10,
    Pause,
    PlayArrow,
    SkipNext,
    VolumeUp,
    VolumeOff,
    Fullscreen,
    FullscreenExit,
    KeyboardBackspace,
    ArrowBackIosNew,
} from "@mui/icons-material";
import BufferingSpinner from "./bufferingSpinner";
import { useState } from "react";

const PrettoSlider = styled(Slider)({
    height: "8px",
    color: "#F8F9FA",
    '& .MuiSlider-thumb': {
        height: 16,
        width: 16,
        backgroundColor: "#F8F9FA",
        border: "1px solid currentColor",
        marginTop: 0,
        marginLeft: 0,
        "&:focus, &:hover, &.Mui-active": {
            boxShadow: "none",
        },
    },
    '& .MuiSlider-track': {
        height: 4,
        borderRadius: 2,
    },
    '& .MuiSlider-rail': {
        height: 4,
        borderRadius: 2,
    },

    // Responsividade Slider
    '@media (max-width: 300px)': {
        height: "6px",
        '& .MuiSlider-thumb': {
            height: 12,
            width: 12,
        },
        '& .MuiSlider-track, & .MuiSlider-rail': {
            height: 3,
        }
    }
});

const VolumeSlider = styled(Slider)({
    width: "80px",
    color: "#F8F9FA",
    transition: "width 150ms ease-in-out",
    "&:hover": {
        width: "80px",
    },

    '@media (max-width: 300px)': {
        width: "60px",
        '&:hover': {
            width: "60px",
        }
    }
});

const IconBtn = styled(IconButton)({
    color: "#F8F9FA",
    padding: "0px 6px",
    "&:hover": {
        opacity: 0.80,
    },

    '@media (max-width: 300px)': {
        padding: "0px 4px",
    }
});

const ControlContainer = styled('div')({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "8px",
    flexWrap: "wrap",

    '@media (max-width: 300px)': {
        paddingBottom: "4px",
    }
});

const BottomContainer = styled('div')({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "0px 10px",
    flexWrap: "wrap",
    '@media (max-width: 384px)': {
        padding: "0px 5px",
        

    }
});

// Componente principal Control
const Control = ({
    videoTitle,
    onPlayPause,
    playing,
    onRewind,
    onForward,
    played,
    onSeek,
    onSeekMouseUp,
    onVolumeChangeHandler,
    onVolumeSeekUp,
    volume,
    mute,
    onMute,
    duration,
    currentTime,
    onMouseSeekDown,
    controlRef,
    buffer,
    playerRef,
    playbackSpeedHandler,
    playrateValue,
    handleNextEpisode,
    nextEpisodeAvailable,
    routerPush
}: any) => {
    const [fullscreen, setFullscreen] = useState(false)
    return (
        <ControlContainer className={styles.control_Container} ref={controlRef}>
            <div className={styles.top_container}>
                <IconBtn onClick={routerPush}>
                    <ArrowBackIosNew fontSize="large" />
                </IconBtn>
                <h2 className={styles.h2}>{videoTitle}</h2>
            </div>
            <div className={styles.mid_container}>
                <IconBtn onClick={onRewind}>
                    <Replay10 fontSize="medium" /> {/* Tamanho reduzido */}
                </IconBtn>
                {buffer ? (
                    <BufferingSpinner />
                ) : (
                    <IconBtn onClick={onPlayPause}>
                        {playing ? <Pause style={{ fontSize: '48px' }} /> : <PlayArrow style={{ fontSize: '48px' }} />} {/* Tamanho reduzido */}
                    </IconBtn>
                )}
                <IconBtn onClick={onForward}>
                    <Forward10 fontSize="medium" /> {/* Tamanho reduzido */}
                </IconBtn>
            </div>
            <BottomContainer>
                <div className={styles.slider_container}>
                    <PrettoSlider
                        min={0}
                        max={100}
                        value={played * 100}
                        onChange={onSeek}
                        onChangeCommitted={onSeekMouseUp}
                        onMouseDown={onMouseSeekDown}
                    />
                </div>
                <div className={styles.control_box}>
                    <div className={styles.inner_controls}>
                        <IconBtn onClick={onPlayPause}>
                            {playing ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                        </IconBtn>
                        <IconBtn disabled={!nextEpisodeAvailable}>
                            <SkipNext fontSize="large" onClick={handleNextEpisode} />
                        </IconBtn>
                        <div className={styles.volume_control}>
                            <IconBtn onClick={onMute}>
                                {mute ? <VolumeOff fontSize="large" /> : <VolumeUp fontSize="large" />}
                            </IconBtn>
                            <VolumeSlider
                                className={styles.volume_slider}
                                onChange={onVolumeChangeHandler}
                                value={volume * 100}
                                onChangeCommitted={onVolumeSeekUp}
                            />
                        </div>
                        <span className={styles.span}>{`${currentTime}   :   ${duration}`}</span>
                    </div>
                    <div className={styles.side_controls}>
                        <IconBtn onClick={playbackSpeedHandler}>
                            <span>{playrateValue}x</span>
                        </IconBtn>
                        <IconBtn onClick={() => {
                            const player = playerRef.current?.getInternalPlayer()
                            const container = player.parentElement?.parentElement
                            if (!document.fullscreenElement) {
                                if (container?.requestFullscreen) {
                                    setFullscreen(true)
                                    container.requestFullscreen()
                                }
                            } else {
                                if (document.exitFullscreen) {
                                    setFullscreen(false)
                                    document.exitFullscreen();
                                }
                            }
                        }}>
                            {(fullscreen) ? <FullscreenExit fontSize="large" /> : <Fullscreen fontSize="large" />}
                        </IconBtn>
                    </div>
                </div>
            </BottomContainer>
        </ControlContainer>
    )
}
export default Control