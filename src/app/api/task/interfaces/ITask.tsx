import IUser from '../../account/interfaces/IUser';

interface ITask {
    _id:  string;
    timestamp:  number;
    access: number[];    
    assignee: IUser;
    assignor: IUser;
    counters: any;
    title: string;
    description: string;
    due_data_has_clock: boolean;
    due_date: number;
    status: number;
    todos: any[];
}
export default ITask;
