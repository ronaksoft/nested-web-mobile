
import * as React from 'react';
import statuses from '../../api/consts/CTaskProgressTask';

const style = require('./taskIcon.css');
import {IcoN} from 'components';

interface IProps {
    status: string;
    progress?: number;
}

interface IState {
    status: string;
    progress: number;
}

class TaskIcon extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            status: this.props.status,
            progress: this.props.progress,
        };
    }

    public componentWillReceiveProps(newProps: IProps) {
        this.setState({
            status: newProps.status,
            progress: newProps.progress,
        });
    }

    public render() {
        const {status} = this.state;
        let strokeDasharray = '0 60';
        if (status === statuses.ASSIGNED_PROGRESS && this.state.progress !== undefined) {
            strokeDasharray = (this.state.progress / 100) * 56.4 + ' 60';
        }
        return (
            <div className={style.taskProgressIcon}>
                {status === statuses.NOT_ASSIGNED && <IcoN name={'candidate32'} size={32}/>}
                {status === statuses.ASSIGNED_NO_CHECKLIST && <IcoN name={'inProgressSimple32'} size={32}/>}
                {status === statuses.ASSIGNED_CHECKLIST && <IcoN name={'inProgressWithTodo32'} size={32}/>}
                {status === statuses.ASSIGNED_PROGRESS && <IcoN name={'inProgressWithTodo32'} size={32}/>}
                {status === statuses.ASSIGNED_PROGRESS && (
                    <div className={style.progress}>
                        <svg>
                            <circle r="9" cx="9" cy="9" style={{strokeDasharray}}/>
                        </svg>
                    </div>
                )}
                {status === statuses.COMPLETED && <IcoN name={'completed32'} size={32}/>}
                {status === statuses.HOLD && <IcoN name={'hold32'} size={32}/>}
                {status === statuses.REJECTED && <IcoN name={'rejected32'} size={32}/>}
                {status === statuses.OVERDUE && <IcoN name={'overdue32'} size={32}/>}
                {status === statuses.FAILED && <IcoN name={'failed32'} size={32}/>}
            </div>
        );
    }
}

export {TaskIcon}
