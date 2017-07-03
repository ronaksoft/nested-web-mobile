import * as React from 'react';
import { Checkbox } from 'antd';
import IFile from '../IFile';
import 'antd/dist/antd.css';

interface IProps {
  file: IFile;
}
class Pdf extends React.Component<IProps, any> {
    public render() {
        return (
            <div>
            <div>
              <Checkbox/>
            </div>
                <div>
                    <div>
                        <img/>
                    </div>
                    <div>
                        <div>
                            <span>{this.props.file.id}. {this.props.file.name}</span>
                        </div>
                        <div>
                            <span>64KB</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { Pdf }
