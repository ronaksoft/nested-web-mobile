interface ISendRequest {
  targets: string;
  content_type?: string;
  subject?: string;
  body?: string;
  no_comment?: boolean;
  attaches?: string;
  reply_to?: string;
  forward_from?: string;
}

export default ISendRequest;