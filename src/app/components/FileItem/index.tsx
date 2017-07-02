import * as React from 'react';
import { Pdf } from './Pdf';
import 'antd/dist/antd.css';

class FileItem extends React.Component<any, any> {
    public render() {
        return (
            <div>
                file
                <Pdf/>
            </div>
        );
    }
}

export { FileItem }
