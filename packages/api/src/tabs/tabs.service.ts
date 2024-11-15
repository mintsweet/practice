import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tab } from '@/entities';

@Injectable()
export class TabsService {
  constructor(@InjectRepository(Tab) private readonly tab: Repository<Tab>) {}

  public async createTab(sign: string, summary: string) {
    const exist = await this.tab.exist({ where: { sign } });

    if (exist) {
      throw new Error(`The tab ${sign} already exists`);
    }

    const tab = await this.tab.save({ sign, summary });

    return tab.id;
  }

  public async deleteTab(id: string) {
    return this.tab.update({ id }, { isDelete: true });
  }

  public async updateTab(
    id: string,
    { sign, summary }: { sign?: string; summary?: string },
  ) {
    if (sign) {
      const exist = await this.tab.exist({ where: { sign } });

      if (exist) {
        throw new Error(`The tab ${sign} already exists`);
      }
    }

    return this.tab.update({ id }, { sign, summary });
  }

  public async getTabs() {
    return this.tab.find({ select: ['sign', 'summary'] });
  }
}
