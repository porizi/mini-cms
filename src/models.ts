import {ICmsContext, ICmsDataDbModel} from './lib/cms/models';

export interface IDictionary<T> {
  [key: string]: T
}

interface IHomeData {
  bio: string
}

interface IEventData {
  title   : string
  location: string
}

export interface ICmsData extends ICmsDataDbModel {
  home : IHomeData
  event: IEventData
}

export interface ICmsContext {
  cmsData: ICmsData
}
