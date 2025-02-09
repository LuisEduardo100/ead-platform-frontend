'use client'
import styles from './styles.module.scss'
import { EpisodeFileTypeAdapted } from '../../../services/courseService'
import { Download, VideoFile } from '@mui/icons-material'
import { useEffect, useState } from 'react';
import profileService from '../../../services/profileService';

type FileListProps = {
    files: EpisodeFileTypeAdapted[];
    onFileClick: (url: string) => void
};

export default function FileListToEpisode({ files, onFileClick }: FileListProps) {
    const [hasFullAccess, setHasFullAccess] = useState<boolean>()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await profileService.fetchCurrent();
                setHasFullAccess(userData.hasFullAccess);
            } catch (error) {
                console.error("Erro ao buscar perfil do usuário:", error);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className={styles.divPai}>
            {hasFullAccess ? (
                <>
                    <h4 className={styles.titulofile}>Material: </h4>
                    {files.map((file) => (
                        <div key={file.id} className={styles.divFiles}>
                            {file.fileUrl.map((url: any, index: any) => (
                                <div key={index} className={styles.file} onClick={() => onFileClick(url)}>
                                    {url.endsWith('.pdf') ? (<a className={styles.link}>
                                        <Download style={{ fontSize: '20px', color: '#183153', marginRight: '8px' }} />
                                        {file.name}
                                    </a>) :
                                        (<a className={styles.link}>
                                            <VideoFile style={{ fontSize: '20px', color: '#183153', marginRight: '8px' }} />
                                            {file.name}
                                        </a>)
                                    }
                                </div>
                            ))}
                        </div>
                    ))}
                </>
            ) : (
                <h4 className={styles.titulofile}>Matricule-se para ter acesso ao material dessa aula. </h4>
            )}
        </div>
    );
};
