interface IRequest {
  _reqid?: string;
  cmd: string;
  data?: {};
  withoutQueue?: boolean;
}

export default IRequest;
