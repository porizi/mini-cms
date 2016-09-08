import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {browserHistory, Router} from 'react-router';
import {CMSProvider} from './lib/cms/components/CMSProvider';
import {isUserAuthorized} from './utils/auth';
import routes from './routes/index';

// This method of initialization allows to pass variables from
// the server to the client in order to properly initialize
// external libraries which require special configuration
window['MINI_CMS_APP'] = window['MINI_CMS_APP'] || (() => {
  return {
    initialize: (config) => {
      ReactDOM.render(
        <CMSProvider cmsData={config.cmsData} isInEditMode={isUserAuthorized()}>
          <Router history={browserHistory}>
            { routes }
          </Router>
        </CMSProvider>,
        document.getElementById('root')
      );
    }
  };
})();
