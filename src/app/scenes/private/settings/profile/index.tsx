import * as React from 'react';
import AccountApi from 'api/account/index';
import AttachmentApi from 'api/attachment/index';
import {connect} from 'react-redux';
import {IUser} from 'api/interfaces';
import {IProfile} from 'api/account/interfaces';
import Configuration from 'config';
import AAA from 'services/aaa';
// import TimeUtiles from 'services/utils/time';
import {Scrollable, IcoN, UserAvatar, NstCrop, NstInput} from 'components';
import {userUpdate} from 'redux/app/actions';
import {Switch} from 'antd';
import {cloneDeep} from 'lodash';

const style = require('./style.css');

/**
 * @interface IState
 */
interface IState {
  user: IUser;
  profile: IProfile;
  pickedImage: any;
  uploadPercent: number;
}

/**
 * @interface IProps
 */
interface IProps {
  location: any;
  user: any;
  userUpdate: (user: IUser) => {};
}

class Profile extends React.Component<IProps, IState> {

  private accountApi: AccountApi;
  private attachmentApi: AttachmentApi;
  private updateObj: IProfile;
  private timeout: any;

  constructor(props) {
    super(props);
    this.updateObj = {};
    this.state = {
      user: props.user,
      uploadPercent: 0,
      profile: {
        dob: props.user ? props.user.dob : '',
        fname: props.user ? props.user.fname : '',
        lname: props.user ? props.user.lname : '',
        email: props.user ? props.user.email : '',
        gender: props.user ? props.user.gender : '',
        searchable: props.user ? props.user.searchable : '',
      },
      pickedImage: null,
    };
    this.accountApi = new AccountApi();
    this.attachmentApi = new AttachmentApi();
  }

  // public componentDidMount() {
  // }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      user: newProps.user,
      profile: {
        dob: newProps.user ? newProps.user.dob : '',
        fname: newProps.user ? newProps.user.fname : '',
        lname: newProps.user ? newProps.user.lname : '',
        email: newProps.user ? newProps.user.email : '',
        gender: newProps.user ? newProps.user.gender : '',
        searchable: newProps.user ? newProps.user.searchable : '',
      },
    });
  }

  private pickFile = (e: any) => {
    const file = e.target.files.item(0);
    const imageType = /^image\//;

    if (!file || !imageType.test(file.type)) {
      return;
    }
    this.setState({
      pickedImage: file,
    });
  }

  private updateModel = (data) => {
    const user = cloneDeep(this.state.user);
    user.picture = data.pictureData;
    this.accountApi.setPicture(data.picture).then(() => {
      this.props.userUpdate(user);
      this.setState({user});
    });
  }

  private onCropped = (file: any) => {
    const that = this;
    const formData = new FormData();
    formData.append('blob', file, file.name);
    const credentials = AAA.getInstance().getCredentials();
    const xhr = new XMLHttpRequest();
    this.setState({
        uploadPercent: 0,
    });
    // this.attachmentApi.upload(file, 'profile_pic');
    this.attachmentApi.getUploadToken().then((token) => {
      xhr.open('POST', `${Configuration().STORE.URL}/upload/profile_pic/${credentials.sk}/${token}`, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      // xhr.setRequestHeader('Access-Control-Allow-Origin', location.host);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          const resp = JSON.parse(xhr.response);
          that.updateModel({
              picture: resp.data.files[0].universal_id,
              pictureData: resp.data.files[0].thumbs,
          });
          that.setState({
              uploadPercent: 0,
          });
        }
      };
      xhr.onprogress = (e: any) => {
        this.setState({
          uploadPercent: Math.ceil((e.loaded / e.total) * 100),
        });
      };
      xhr.send(formData);

    });

  }

  private update = (field, value) => {
    const {profile} = this.state;
    profile[field] = value;
    this.setState({
      profile,
    });
    this.serverUpdate(field, value);
  }

  private serverUpdate = (field, value) => {
    this.updateObj[field] = value;
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.timeout = window.setTimeout(() => {
      this.accountApi.update(this.updateObj).then(console.log).catch(console.log);
      this.updateObj = {};
      const user = Object.assign({}, this.state.user, this.state.profile);
      this.props.userUpdate(user);
    }, 512);
  }

  private handleGenderChange = (event) => {
    this.update('gender', event.currentTarget.value);
  }

  private searchableChange = (isChecked) => {
    this.update('searchable', isChecked);
  }

  public render() {
    const {user, profile} = this.state;
    return (
      <Scrollable active={true}>
        <div className={style.profile}>
          <div className={style.avatarContainer}>
            <div className={style.imageContainer}>
              {user && <UserAvatar user_id={user} size={72} borderRadius={'36px'}/>}
              <label className={style.uploadLayer} htmlFor="avatar">
                <IcoN name="cameraWhite16" size={16}/>
              </label>
              <input type="file" id="avatar" hidden={true} style={{display: 'none'}}
                onChange={this.pickFile}/>
            </div>
          </div>
          {user && (
            <div className={style.userData}>
              <NstInput value={profile.fname} label="First name" placeholder="First name"
                onChange={this.update.bind(this, 'fname')}/>
              <NstInput value={profile.lname} label="Last name" placeholder="Last name"
                onChange={this.update.bind(this, 'lname')}/>
              <NstInput value={user._id} label="User ID" disabled={true}/>
              <NstInput value={user.phone} label="Phone number" placeholder="Phone number" disabled={true}/>
              <NstInput value={profile.email} label="Email address" placeholder="Email address"
                onChange={this.update.bind(this, 'email')}/>
              <NstInput type="date" value={profile.dob} label="Date of birth" placeholder="Date of birth"
                onChange={this.update.bind(this, 'dob')}/>
              <label>Gender</label>
              <select value={profile.gender} onChange={this.handleGenderChange}>
                <option value="f">Female</option>
                <option value="m">Male</option>
                <option value="o">Other</option>
              </select>
              <div className={style.searchable}>
                <label htmlFor="searchable">
                  <span>Searchable</span>
                  <Switch defaultChecked={profile.searchable}
                          onChange={this.searchableChange}/>
                </label>
                <aside>
                  Turning your Search on means everyone can reach you, even if they don't know your Place ID.
                </aside>
              </div>
            </div>
          )}
          <NstCrop avatar={this.state.pickedImage}
            onCropped={this.onCropped}/>
        </div>
      </Scrollable>
    );
  }
}

/**
 * redux store mapper
 * @param store
 */
const mapStateToProps = (store) => ({
  user: store.app.user,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    userUpdate: (user: IUser) => {
      dispatch(userUpdate(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
