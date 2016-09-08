import 'whatwg-fetch';
import {IRequestResponseStatus, IRequestResponse} from './models';

/**
 * Send a request to the server in order to update the draft
 * CMS data defined at the specified path
 * @param updatedData - Data to update in the draft CMS data document
 * @param path - Path where the data should be updated
 */
export function updateDraftCmsData(updatedData: any, path: string[]): Promise<IRequestResponse> {
    return fetch('/api/admin/update_draft_cms_data', {
      method : 'POST',
      body   : JSON.stringify({
        updatedData: updatedData,
        path       : path
      }),
      headers: {
        'Accept'      : 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    })
    .then((res: any) => { return res.json(); })
    .then(checkServerError)
}

// Send a request to the server to publish the current
// draft CMS data document
export function publishDraftCmsData(): Promise<IRequestResponse> {
    return fetch('/api/admin/publish_draft_cms_data', {
        method : 'GET',
        headers: {
          'Accept'      : 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      })
      .then((res: any) => { return res.json(); })
      .then(checkServerError)
}

/*=================================================================*/
/**************************Utility Methods**************************/
/*=================================================================*/

/**
 * Throw error when server returns a response with status 'error'
 * @param response - Response sent by server
 */
function checkServerError(response) {
  if (response.status === IRequestResponseStatus.ERROR) {
    throw response;
  } else {
    return response;
  }
}
