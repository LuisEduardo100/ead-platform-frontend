'use client'
import { useRouter } from 'next/navigation'
import styles from './styles.module.scss'
import Link from 'next/link'
import { Button } from 'reactstrap'
import courseService, { CourseType, EpisodeFileType, EpisodeType } from '../../../services/courseService'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons'

type FileListProps = {
    files: EpisodeFileType[];
    onFileClick: (url: string) => void
};

export default function FileList({ files, onFileClick }: FileListProps) {
    return (
        <div className={styles.divPai}>
            <h4 className={styles.titulofile}>Material: </h4>
            {files.map((file) => (
                    <div className={styles.divFiles}>
                        {file.fileUrl.map((url: any, index: any) => (
                            <div key={index} className={styles.file} onClick={() => onFileClick(url)}>
                                <a>
                                    <FontAwesomeIcon icon={faCloudArrowDown} style={{ color: '#183153', marginRight: '8px' }} />
                                    {file.name}
                                </a>
                            </div>
                        ))}
                    </div>
            ))}
        </div>
    );
};
