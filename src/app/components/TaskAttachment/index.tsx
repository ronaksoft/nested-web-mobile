import * as React from 'react';
import {connect} from 'react-redux';
import IPostAttachment from '../../api/post/interfaces/IPostAttachment';
import {IcoN} from 'components';
import C_FILE_TYPE from 'api/consts/CFileType';
import FileUtiles from 'services/utils/file';
import {setCurrentAttachment, setCurrentAttachmentList,
  setCurrentPost} from '../../redux/attachment/actions/index';
const style = require('./style.css');

interface IOwnProps {
  /**
   * @property {Array<IPostAttachment>} attachments - list of attachments
   * @desc routing state receive from react-router-redux
   * @type {array<IPostAttachment>}
   * @memberof IProps
   */
  attachments: any[];
  taskId: string;
  editable: boolean;
}
interface IProps {
  attachments: any[];
  taskId: string;
  editable: boolean;
  currentAttachment: IPostAttachment[];
  currentAttachmentList: IPostAttachment[];
  setCurrentPost: (postId: string) => void;
  setCurrentAttachment: (attachment: IPostAttachment) => void;
  setCurrentAttachmentList: (attachments: IPostAttachment[]) => void;
}

interface IState {
  attachments: any[];
  editable: boolean;
  selectedAttachment: IPostAttachment | null;
}
class TaskAttachmentClass extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      attachments: props.attachments,
      selectedAttachment: null,
      editable: props.editable === false ? false : true,
    };
  }
  /**
   * open AttachmentView for attachment
   * @private
   * @param {IPostAttachment} attachment - picked up attachment for view
   * @memberof PostAttachment
   */
  private showAttachment(attachment: IPostAttachment) {
    this.setState({
      selectedAttachment: attachment,
    });
    this.props.setCurrentPost(this.props.taskId);
    this.props.setCurrentAttachment(attachment);
    this.props.setCurrentAttachmentList(this.props.attachments);
  }

  public componentWillReceiveProps(nProps: IProps) {
    this.setState({
      attachments: nProps.attachments,
      editable: nProps.editable,
    });
  }
  private getThumbnail = (item, size?) => {
    if (item.thumbs && item.thumbs.x32 && item.thumbs.x64) {
      return FileUtiles.getViewUrl(size ? item.thumbs.x64 : item.thumbs.x32);
    } else {
      if (item.type === C_FILE_TYPE.AUDIO || item.type === C_FILE_TYPE.VIDEO) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_media@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_media.png';
        }
      } else if (item.type === C_FILE_TYPE.ARCHIVE) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_zip@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_zip.png';
        }
      } else if (item.type === C_FILE_TYPE.DOCUMENT) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_document@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_document.png';
        }
      } else if (item.type === C_FILE_TYPE.PDF) {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_pdf@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_pdf.png';
        }
      } else {
        if (size) {
          return '/public/assets/icons/ph_small_attachment_other@2x.png';
        } else {
          return '/public/assets/icons/ph_small_attachment_other.png';
        }
      }
    }
  }
  public render() {
    const {attachments} = this.state;

    attachments.forEach((attach) => {
      attach.thumb = this.getThumbnail(attach);
      attach.thumb2x = this.getThumbnail(attach, '@2x');
    });

    return (
      <ul className={style.attachmentList}>
        {attachments.map((item) => (
          <li key={item._id} onClick={this.showAttachment.bind(this, item)}>
            <div className={style.icon}>
              <img width="32" src={item.thumb}
                srcSet={item.thumb2x} height="32"/>
                <div className={style.delete}>
                  <IcoN name="xcrossWhite24" size={24}/>
                </div>
              {item.isFailed && <IcoN name="bin16" size={16}/>}
            </div>
            <div>
              <span>{(item.filename).toLowerCase()}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

/**
 * redux store mapper
 * @param store
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  currentAttachment: store.attachments.currentAttachment,
  currentAttachmentList: store.attachments.currentAttachmentList,
  attachments: ownProps.attachments,
  taskId: ownProps.taskId,
  editable: ownProps.editable,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentAttachment: (attach: IPostAttachment) => {
      dispatch(setCurrentAttachment(attach));
    },
    setCurrentAttachmentList: (attachs: IPostAttachment[]) => {
      dispatch(setCurrentAttachmentList(attachs));
    },
    setCurrentPost: (postId: string) => {
      dispatch(setCurrentPost(postId));
    },
  };
};
const TaskAttachment = connect(mapStateToProps, mapDispatchToProps)(TaskAttachmentClass);
export {TaskAttachment};
