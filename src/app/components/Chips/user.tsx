import * as React from 'react';
import {IcoN} from 'components';
import FileUtil from 'services/utils/file';
import './chips.css';
const style = require('./chips.css');

const unknownPicture = require('assets/images/ph_user.png');
interface IChipsProps {
    user: any;
    editable?: boolean;
    candidate?: boolean;
    onRemove?: (id: string) => void;
    onChipsClick?: any;
    active: boolean;
}

interface IChipsState {
    isSelected?: boolean;
    active?: boolean;
}
export class UserChips extends React.Component<IChipsProps, IChipsState> {
    constructor() {
        super();
        this.state = {
            isSelected : false,
            active : false,
        };
    }

    /**
     * update the state object when the parent whisp chips is selected
     * @param {IChipsProps} nextProps
     * @memberof PlaceChips
     */
    public componentWillReceiveProps(nextProps) {
        this.setState(
        {
            active : nextProps.active,
        },
        );
    }

    private toggleSelect = () => {
        if (this.props.editable) {
            this.setState({
                isSelected: !this.state.isSelected,
            });
            if (this.props.onChipsClick) {
                this.props.onChipsClick(this.props.user);
            }
        }
    }

    private clearItem = () => {
        if (this.props.editable && this.props.onRemove) {
            this.props.onRemove(this.props.user._id);
        }
    }

    /**
     * Gets place image source
     * @private
     * @param {IChipsItem} item
     * @returns {string} place picture url
     * @memberof PlaceChips
     */
    private getPicture(item) {
        if (item && item.picture && item.picture.x64) {
        return FileUtil.getViewUrl(item.picture.x64);
        }

        return unknownPicture;
    }

    public render() {
        const {user, editable, candidate} = this.props;
        return (
            <div className={[
                    style.userChipsWrapper,
                    candidate ? style.isCandidate : '',
                    this.state.isSelected ? style.isSelected : '',
                    editable ? style.access : '',
                ].join(' ')}
                onClick={this.toggleSelect}>
                <div className={style.userAvatar16} onClick={this.clearItem}>
                    <img src={this.getPicture(this.props.user)} className={style.accountInitials16}/>
                    {editable && <IcoN name="xcross16Red" size={16}/>}
                </div>
                <span>
                    {user.fullName && user.fullName}
                    {!user.fullName && user.fname + ' ' + user.lname}
                </span>
            </div>
        );
    }
}
