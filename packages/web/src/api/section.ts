import { request } from '@mints/request';

interface ISection {
  id: string;
  name: string;
  description: string;
}

export function query(): Promise<ISection[]> {
  return request.public('/sections');
}
