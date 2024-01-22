import { OutLinkTypeEnum } from './constant';

export type OutLinkSchema = {
  _id: string;
  shareId: string;
  teamId: string;
  tmbId: string;
  appId: string;
  name: string;
  total: number;
  lastTime: Date;
  type: `${OutLinkTypeEnum}`;
  responseDetail: boolean;
  responseSource: boolean;
  limit?: {
    expiredTime?: Date;
    QPM: number;
    credit: number;
    hookUrl?: string;
  };
};

export type OutLinkEditType = {
  _id?: string;
  name: string;
  responseDetail: OutLinkSchema['responseDetail'];
  responseSource: OutLinkSchema['responseSource'];
  limit: OutLinkSchema['limit'];
};
