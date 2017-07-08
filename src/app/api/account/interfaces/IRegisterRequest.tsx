interface IRegisterRequest {
  vid: string;
  phone: string;
  country: string;
  uid: string;
  pass: string;
  fname: string;
  lname: string;
  email?: string;
}

export default IRegisterRequest;