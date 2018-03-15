import * as React from 'react';
import {IcoN} from 'components';
import './chips.css';
const style = require('./chips.css');

interface IChipsProps {
    label: any;
    editable?: boolean;
    access?: boolean;
}

interface IChipsState {
    isSelected?: boolean;
}
class LabelChips extends React.Component<IChipsProps, IChipsState> {
    constructor() {
        super();
        this.state = {
            isSelected : false,
        };
    }

    private toggleSelect = () => {
        if (this.props.editable) {
            this.setState({
                isSelected: !this.state.isSelected,
            });
        }
    }
    public render() {
        const {label, editable, access} = this.props;
        return (
            <div className={[style.labelChipsWrapper, style['color-lbl-shadow-' + label.code]
                , this.state.isSelected ? style.isSelected : '', editable ? style.access : ''].join(' ')}
                onClick={this.toggleSelect}>
                <div className={style.labelEdge + ' ' + style['color-lbl-bg-' + label.code]}>
                    <i className={[style.labelEdge, style['color-lbl-' + label.code]].join(' ')}
                        dangerouslySetInnerHTML={{
                            __html: `<svg width="18" height="22" viewBox="0 0 18 22" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <path d="M7.657,19.657,1.829,13.829a4,4,0,0,1,0-5.657L7.657,2.344A8,8,0,0,1,13.314,
                                    0H18V22H13.314A8,8,0,0,1,7.657,19.657ZM10,8a3,3,0,1,0,3,3A3,3,0,0,0,10,8Z"/>
                                </svg>`,
                            }}/>
                    {!editable && <i/>}
                    {(editable && access) && <IcoN name="xcross16" size={16}/>}
                    {(editable && !access) && <IcoN name="lock16" size={16}/>}
                </div>
                <span className={style['color-lbl-bg-' + label.code]}>
                    {label.title}
                </span>
            </div>
        );
    }
}
export {LabelChips}
