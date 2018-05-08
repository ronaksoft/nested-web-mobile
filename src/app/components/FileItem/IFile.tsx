interface IThumb {
  org: string;
  pre: string;
  x32: string;
  x64: string;
  x128: string;
}
interface IFile {
  _id: string;
  meta?: any;
  type: string;
  size: number;
  date?: string;
  width?: number;
  thumbs?: IThumb;
  height?: number;
  post_id?: string;
  filename: string;
  mimetype?: string;
  tmpEditing?: boolean;
  upload_type?: string;
  upload_time?: string;
}
export default IFile;
