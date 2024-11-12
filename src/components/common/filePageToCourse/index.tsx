'use client'
import styles from './styles.module.scss'
import { EpisodeFileType } from '../../../services/courseService'
import { Download } from '@mui/icons-material';
import { useRef } from 'react';


type FileListProps = {
    files: EpisodeFileType[];
};

export default function FileListToCourse({ files }: FileListProps) {

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const url = event.target.value;
        if (url) {
            const link = document.createElement('a');
            link.href = `${process.env.NEXT_PUBLIC_BASEURL}/${url}`;
            link.target = '_blank'
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const selectRef = useRef<HTMLSelectElement>(null);

    const handleIconClick = () => {

        setTimeout(() => {
            if (selectRef.current) {
                selectRef.current.showPicker();  // Abre o dropdown
            }

        }, 50)
    };
    return (
        <div onClick={handleIconClick} className={styles.divPai}>
            <label htmlFor='select' className={styles.downloadIcon} >
                <Download style={{ fontSize: '24px', color: '#183153' }} />
            </label>
            <select ref={selectRef} id='select' className={styles.select} onChange={handleSelectChange} defaultValue="">
                <option value="" disabled>
                    Material dessa aula
                </option>
                {files.map((file) =>
                    file.fileUrl
                        .filter((url: string) => url.endsWith('.pdf'))
                        .map((url: string, index: number) => (
                            <option className={styles.option} key={index} value={url}>
                                {file.name}
                            </option>
                        ))
                )}
            </select>
        </div>
    );
}