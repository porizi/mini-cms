import {isProduction} from './server/utils/is_production';
if(!isProduction()) { require('dotenv').config(); }
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {connectToDb} from './server/db/config';
import { Router, RouterContext, match } from 'react-router';
import {getAllComponentsCSS} from './utils/css_styler';
import {isUserAuthorized} from './utils/auth';
import routes from './routes';
import {CMSProvider} from './lib/cms/components/CMSProvider';
import {updateDraftCmsDataHandler, publishDraftCmsDataHandler, getCmsData} from './lib/cms/server';

const port = (parseInt(process.env.PORT, 10) || 3000) - (!isProduction() as any);
const app = express();

// Support json encoded bodies
app.use(bodyParser.json());

// Set view engine
app.set('views', './src/server/views');
app.set('view engine', 'ejs');
app.use('/styles.css', express.static('./build/styles.css'));
app.use('/client.js', express.static('./build/client.js'));
app.use('/images', express.static('./public/images'));

// Private admin API endpoints
// TODO: This route should later on be protected such that
// only admin users can access it
app.post('/api/admin/update_draft_cms_data', (req: any, res: any) => {
  updateDraftCmsDataHandler(app.locals.db, req, res);
});
app.get('/api/admin/publish_draft_cms_data', (req: any, res: any) => {
  publishDraftCmsDataHandler(app.locals.db, req, res);
});

// Endpoint to get all React components CSS
app.get('/components.css', (req, res) => {
  res.setHeader('content-type', 'text/css');
  res.send(getAllComponentsCSS());
});

// Route handler that rules them all!
app.get('*', (req: any, res: any) => {

  // Do a router match
  match({
    routes: (<Router>{routes}</Router>),
    location: req.url,
  },
  (err: any, redirect: any, props: any) => {
    // Some sanity checks
    if (err) {
      return res.status(500).send(err.message);
    } else if (redirect) {
      return res.redirect(302, redirect.pathname + redirect.search);
    } else if (!props) {
      return res.status(404).send('not found');
    }

    getCmsData(app.locals.db, isUserAuthorized())
      .then((cmsData) => {
        // Respond with EJS template
        res.render('index', {
          renderedRoot: ReactDOMServer.renderToString(
            <CMSProvider cmsData={cmsData} isUserAuthorized={isUserAuthorized()}>
              <RouterContext {...props}/>
            </CMSProvider>
          ),
          cmsData: cmsData
        });
      })
      .catch((err: string) => { return res.status(500).send(err) })
  });
});

const server = http.createServer(app);

// Open a new connection when Node.js app starts, reuse the existing
// db connection object. See more: http://bit.ly/2aw94I9
connectToDb()
    .then((db) => {
        console.log('Connected successfully to database server');
        app.locals.db = db; // Make db accessible through out the application
        server.listen(port, (err:any) => {
            if (err) throw err;
            console.info(`[🚀 ] Server started on port ${port}`); // eslint-disable-line
        });
    })
    .catch(err => console.error(err));
