import * as Immutable from 'immutable';
import {MongoClient, Db, InsertOneWriteOpResult, MongoError,
       FindAndModifyWriteOpResultObject} from 'mongodb';
import {ICmsDataDbModel, IRequestResponseStatus} from './models';

const CMS_DATA_COLLECTION: string = 'cms_data';

/**
 * Return CMS data taking into consideration if the current
 * user is authorized to see the draft
 * @param db - An open connection to mongodb
 * @param isUserAuthorized - Determines if user has permission to see draft CMS data
 */
export function getCmsData(db: Db, isUserAuthorized: boolean): Promise<ICmsDataDbModel> {
  if(isUserAuthorized) {
    return getCurrentDraftCmsData(db);
  } else {
    return getPublishedCmsData(db);
  }
}

/**
 * Handles updating the existing cms data draft
 * @param req - Request sent by the client
 * @param res - Response to send to the client
 */
export function updateDraftCmsDataHandler(db: Db, req: any, res: any): void {
  const updatedData: any = req.body.updatedData; // Updated data for the desired path
  const path: string[] = req.body.path; // Path where the updated data should be saved
  findOrCreateDraftCmsData(db)
    .then((currentDraftCmsData: ICmsDataDbModel) => {
      const updatedDraftCmsData: ICmsDataDbModel = Immutable.fromJS(currentDraftCmsData)
                                                    .setIn(path, updatedData)
                                                    .toJS();
      return updateDraftCms(db, updatedDraftCmsData);
    })
    .then((draftCmsData: ICmsDataDbModel) => {
      res.status(200).send({data: draftCmsData, status: IRequestResponseStatus.OK});
    })
    .catch((err: Error) => {
      res.status(500).send({error: err.message, status: IRequestResponseStatus.ERROR});
    });
}

/**
 * Handles publishing the existing cms data draft
 * @param req - Request sent by the client
 * @param res - Response to send to the client
 */
export function publishDraftCmsDataHandler(db: Db, req: any, res: any) {
  findOrCreateDraftCmsData(db)
    .then((currentDraftCmsData: ICmsDataDbModel) => {
      const updatedDraftCmsData: ICmsDataDbModel = Immutable.fromJS(currentDraftCmsData)
                                                    .setIn(['published'], true)
                                                    .toJS();
      return updateDraftCms(db, updatedDraftCmsData);
    })
    .then((draftCmsData: ICmsDataDbModel) => {
      res.status(200).send({data: draftCmsData, status: IRequestResponseStatus.OK});
    })
    .catch((err: Error) => {
      res.status(500).send({error: err.message, status: IRequestResponseStatus.ERROR});
    });
}

/*=================================================================*/
/**************************Utility Methods**************************/
/*=================================================================*/

// Get the latest published CMS data
function getPublishedCmsData(db: Db): Promise<ICmsDataDbModel> {
  return new Promise((resolve, reject) => {
    findLatestPublishedCmsData(db)
      .then((publishedCmsData: ICmsDataDbModel) => {
        if(!publishedCmsData || (publishedCmsData && publishedCmsData.error)) { throw new Error('Unable to find latest published CMS data') }
        resolve(publishedCmsData);
      })
      .catch((err: Error) => reject(err.message));
  });
}

// Find the latest published CMS data configuration
function findLatestPublishedCmsData(db: Db): Promise<ICmsDataDbModel> {
  return new Promise((resolve, reject) => {
    db.collection(CMS_DATA_COLLECTION).find({published: true})
      .limit(1).sort({$natural:-1}) // Make sure we get the latest one
      .next((err, result) => {
        if(err) { reject({ error: err }); }
        resolve(result);
      });
  });
}

// Get the current draft CMS data
function getCurrentDraftCmsData(db: Db): Promise<ICmsDataDbModel> {
  return new Promise((resolve, reject) => {
    findOrCreateDraftCmsData(db)
      .then((draftCmsData: ICmsDataDbModel) => {
        if(!draftCmsData || (draftCmsData && draftCmsData.error)) { throw new Error('Unable to find current draft CMS data') }
        resolve(draftCmsData);
      })
      .catch((err: Error) => reject(err.message));
  });
}

// Finds or creates a draft cms data document
function findOrCreateDraftCmsData(db: Db): Promise<ICmsDataDbModel> {
  return new Promise((resolve, reject) => {
    findDraftCmsData(db)
      .then((draftCmsData: ICmsDataDbModel) => {
        if(draftCmsData) {
          if(draftCmsData.error) { throw new Error(draftCmsData.error); } // Error while retrieving draft cms data
          return draftCmsData; // There's already a draft cms data
        } else {
          return createDraftCmsData(db); // Create new draft cms data
        }
      })
      .then((draftCmsData: ICmsDataDbModel) => { resolve(draftCmsData) })
      .catch((err) => reject(err));
  });
}

// Creates a single draft CMS data based off current published CMS data
function createDraftCmsData(db: Db): Promise<ICmsDataDbModel> {
  return new Promise((resolve, reject) => {
    findLatestPublishedCmsData(db)
      .then((latestCmsData: ICmsDataDbModel) => {
        if(!latestCmsData || (latestCmsData && latestCmsData.error)) { throw new Error('Unable to find latest published CMS data') }
        // Create draft CMS data based off latest published CMS data
        const draftCmsData: ICmsDataDbModel = Immutable.fromJS(latestCmsData)
                                                .setIn(['published'], false)
                                                .deleteIn(['_id'])
                                                .toJS();
        db.collection(CMS_DATA_COLLECTION).insertOne(draftCmsData)
          .then((data: InsertOneWriteOpResult) => {
            if(data.result.ok !== 1) { throw new Error('Unable to create draft CMS data') }
            resolve(draftCmsData);
          })
      })
      .catch((err) => reject(err));
  });
}

// Find the current CMS data draft (if any)
function findDraftCmsData(db: Db): Promise<ICmsDataDbModel> {
  return new Promise((resolve, reject) => {
    db.collection(CMS_DATA_COLLECTION).find({published: false})
      .limit(1).sort({$natural:-1})
      .next((err, result) => {
        if(err) { reject({ error: err }) }
        resolve(result);
      });
  });
}

/*
 * Updates the current draft CMS
 * @param db - An open connection to mongodb
 * @param draftToUpdate - Draft that will be updated in DB
 */
function updateDraftCms(db: Db, draftToUpdate: ICmsDataDbModel): Promise<ICmsDataDbModel> {
  return new Promise((resolve, reject) => {
    db.collection(CMS_DATA_COLLECTION).findOneAndUpdate(
      {_id : draftToUpdate._id},
      {$set: draftToUpdate},
      {returnOriginal: false} // Make sure operation returns the updated object
    ).then((result: FindAndModifyWriteOpResultObject) => {
      if(result.ok !== 1) { reject(new Error('Unable to update draft CMS data')); }
      resolve(result.value);
    }).catch((err: MongoError) => reject(err));
  });
}
