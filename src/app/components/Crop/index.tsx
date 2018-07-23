import * as React from 'react';
import {Modal, Button} from 'antd';
import * as ReactCrop from 'react-image-crop';
// import ReactCrop from 'react-image-crop';

import {isString} from 'lodash';

const style = require('./style.css');

interface IProps {
  avatar: any;
  onCropped: (file: any) => void;
}

interface IStates {
  base64: string;
  crop: any;
  visible: boolean;
  file: any;
}

export default class NstCrop extends React.Component < IProps, IStates > {
  constructor(props: any) {
    super(props);
    this.state = {
      crop: {
        x: 20,
        y: 20,
        aspect: 1,
        keepSelection: true,
      },
      visible: false,
      base64: '',
      file: '',
    };
  }

  private onCropComplete = () => {
    const imgDom = document.getElementsByClassName('ReactCrop__image')[0];
    this
      .getCroppedImg(imgDom, this.state.crop, 'pic.jpg')
      .then((file) => {
        if (file) {
          this
            .props
            .onCropped(file);
          this.handleCancel();
        }
      });
  }

  public componentWillReceiveProps(props: any) {
    let name;
    if (!this.props.avatar) {
      name = '';
    } else {
      name = this.props.avatar.name;
    }
    if (props.avatar && props.avatar.name && props.avatar.name !== name) {
      const file = props.avatar;
      const imageType = /^image\//;

      if (!file || !imageType.test(file.type)) {
        return;
      }
      const reader = new FileReader();

      reader.onload = (e2: any) => {
        this.setState({base64: e2.target.result, file: props.avatar, visible: true});
      };
      reader.readAsDataURL(file);
    }
  }

  private onCropChange = (crop) => {
    this.setState({crop});
  }

  private onImageLoaded = (image) => {
    this.setState({
      crop: ReactCrop.makeAspectCrop({
        x: 0,
        y: 0,
        aspect: 1,
        width: 50,
      }, image.naturalWidth / image.naturalHeight),
    });
  }

  private getCroppedImg = (image: any, pixelCrop: any, fileName: string) => {
    const canvas = document.createElement('canvas');
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    canvas.width = pixelCrop.width * naturalWidth / 100;
    canvas.height = pixelCrop.height * naturalHeight / 100;
    const ctx = canvas.getContext('2d');

    image.style.width = naturalWidth;
    image.style.height = naturalHeight;

    ctx.drawImage(
      image, pixelCrop.x * naturalWidth / 100, pixelCrop.y * naturalHeight / 100,
      pixelCrop.width * naturalWidth / 100, pixelCrop.height * naturalHeight / 100,
      0, 0, pixelCrop.width * naturalWidth / 100, pixelCrop.height * naturalHeight / 100,
    );
    // as Base64 string const base64Image = canvas.toDataURL('image/jpeg'); as a
    // blob var fileObj = new File([base64Image], fileName, {type: 'image/jpeg'});
    return new Promise((resolve) => {
      // console.log(this.state.file, fileObj); resolve(fileObj);
      canvas.toBlob((file: any) => {
        file.name = fileName;
        return resolve(file);
      }, 'image/jpeg');
    });
  }

  private handleCancel = () => {
    this.setState({visible: false});
  }

  public render() {
    const src = isString(this.state.base64)
      ? this.state.base64
      : '';
    const modalFooter = (
      <div className="modal-foot">
        <Button
          type="dashed"
          onClick={this
          .handleCancel}>Discard</Button>
        <Button
          type="primary"
          onClick={this
          .onCropComplete}>Done</Button>
      </div>
    );
    return (
      <Modal
        className={[style.cropModal].join(' ')}
        maskClosable={true}
        width={800}
        closable={true}
        onCancel={this
        .handleCancel}
        visible={this.state.visible}
        footer={modalFooter}
        title="Crop Image">
        <ReactCrop
          src={src}
          onImageLoaded={this
          .onImageLoaded}
          onChange={this
          .onCropChange}
          {...this.state}/>
      </Modal>
    );
  }

}
