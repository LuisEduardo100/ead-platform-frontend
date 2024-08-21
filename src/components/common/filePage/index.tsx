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

const FileList: React.FC<FileListProps> = ({ files, onFileClick }) => {

    return (
        <div>
            {files.map((file) => (
                <div>
                    <div className={styles.divFiles}>
                        <h4 className={styles.titulofile}>Material: </h4>
                        {file.fileUrl.map((url: any, index: any) => (
                            <div key={index} className={styles.file}>
                                <a onClick={() => onFileClick(url)}>
                                    <FontAwesomeIcon icon={faCloudArrowDown} style={{ color: '#183153', marginRight: '8px' }} />
                                    {`File ${index + 1}`}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileList;