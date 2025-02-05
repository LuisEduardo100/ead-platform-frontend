'use client';
import { Container } from "reactstrap";
import styles from "./styles.module.scss";
import Link from "next/link";
import { IconButton, styled } from "@mui/material";
import { ArrowBackIosNew, Home } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface props {
    serie: string | null;
    topic: string | null;
}

const Separation = styled('div')({
    fontSize: '2rem',
    margin: '0 15px 0 15px',
    color: '#a8a8a8',
});

const IconBtn = styled(IconButton)({
    color: "#000",
    "&:hover": {
        opacity: 0.80,
    },

    '@media (max-width: 300px)': {
        padding: "0px 4px",
    }

});
export default function HandoutNavigation({ serie, topic }: props) {
    const router = useRouter()

    function handleHome () {
        router.push('/home')
    }

    return (
        <div className={styles.containerHeader}>
            <IconBtn onClick={handleHome}>
                <Home className={styles.homeIcon} />
            </IconBtn>
            <Separation>&gt;</Separation>
            <Link className={styles.link} href='/apostilas'>apostilas</Link>
            {serie && <Separation>&gt;</Separation>}
            {serie && <Link className={styles.link} href={`/apostilas/${serie}`}>{serie}</Link>}
            {topic && <Separation>&gt;</Separation>}
            {topic && <Link className={styles.link} href=''>{topic}</Link>}
        </div>
    )
};
