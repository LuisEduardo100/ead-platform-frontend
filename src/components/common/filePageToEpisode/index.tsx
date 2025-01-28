'use client'
import styles from './styles.module.scss'
import { EpisodeFileTypeAdapted } from '../../../services/courseService'
import { Download, VideoFile } from '@mui/icons-material'

type FileListProps = {
    files: EpisodeFileTypeAdapted[];
    onFileClick: (url: string) => void
};

export default function FileListToEpisode({ files, onFileClick }: FileListProps) {

    return (
        <div className={styles.divPai}>
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
        </div>
    );
};
