export interface ICmsDataDbModel {
  _id   : string
  error?: string // Useful for checking if the mongodb operation caused an error
}

export class IRequestResponseStatus {
  static OK   :string = 'OK';
  static ERROR:string = 'ERROR';
}

export interface IRequestResponse {
  data? : any    // Data to be sent back to the client (if any)
  error?: string // Error explanation (if any)
  status: string // Statuses defined in 'IRequestResponseStatus'
}

export interface ICmsContext {
  cmsData: ICmsDataDbModel // CMS data
  onCmsDataUpdate: (data: any, path: string[]) => void // Callback to execute when a particular CMS
                                                       // data needs to be updated
}
