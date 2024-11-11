'use client'
import styles from './styles.module.scss'
import { EpisodeFileType } from '../../../services/courseService'
import { Download } from '@mui/icons-material';


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
    return (
        <div className={styles.divPai}>
                <label className={styles.downloadIcon} htmlFor='select'>
                    <Download style={{ fontSize: '24px', color: '#183153' }} />
                </label>
                <select id='select' className={styles.select} onChange={handleSelectChange} defaultValue="">
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