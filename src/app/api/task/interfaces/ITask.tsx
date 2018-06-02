import {IUser, ILabel} from '../../interfaces/';

interface ITask {
    _id: string;
    timestamp: number;
    access: number[];
    assignee: IUser;
    assignor: IUser;
    counters: any;
    title: string;
    description: string;
    desc: string;
    due_data_has_clock: boolean;
    due_date: number;
    status: number;
    attachments: any[];
    watchers: any[];
    editors: any[];
    todos: any[];
    candidates: any[];
    labels?: ILabel[];
    progress?: number;
}
export default ITask;
