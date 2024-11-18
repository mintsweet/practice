import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Tab } from '@/entities';

import { TabsService } from './tabs.service';

describe('TabsService', () => {
  let service: TabsService;
  let repository: jest.Mocked<Repository<Tab>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TabsService,
        {
          provide: getRepositoryToken(Tab),
          useValue: {
            exist: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TabsService>(TabsService);
    repository = module.get<Repository<Tab>>(
      getRepositoryToken(Tab),
    ) as jest.Mocked<Repository<Tab>>;
  });

  describe('createTab', () => {
    it('should create a new tab and return its ID', async () => {
      repository.exist.mockResolvedValue(false);
      repository.save.mockResolvedValue({ id: '123' } as Tab);

      const id = await service.createTab('test-sign', 'test-summary');
      expect(id).toBe('123');
      expect(repository.exist).toHaveBeenCalledWith({
        where: { sign: 'test-sign' },
      });
      expect(repository.save).toHaveBeenCalledWith({
        sign: 'test-sign',
        summary: 'test-summary',
      });
    });

    it('should throw an error if the tab already exists', async () => {
      repository.exist.mockResolvedValue(true);

      await expect(
        service.createTab('test-sign', 'test-summary'),
      ).rejects.toThrow('The tab test-sign already exists');
      expect(repository.exist).toHaveBeenCalledWith({
        where: { sign: 'test-sign' },
      });
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteTab', () => {
    it('should mark a tab as deleted', async () => {
      repository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.deleteTab('123');
      expect(result).toEqual({ affected: 1 });
      expect(repository.update).toHaveBeenCalledWith(
        { id: '123' },
        { isDelete: true },
      );
    });
  });

  describe('updateTab', () => {
    it('should update a tab when the sign does not exist', async () => {
      repository.exist.mockResolvedValue(false);
      repository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.updateTab('123', {
        sign: 'new-sign',
        summary: 'new-summary',
      });
      expect(result).toEqual({ affected: 1 });
      expect(repository.exist).toHaveBeenCalledWith({
        where: { sign: 'new-sign' },
      });
      expect(repository.update).toHaveBeenCalledWith(
        { id: '123' },
        { sign: 'new-sign', summary: 'new-summary' },
      );
    });

    it('should throw an error if the new sign already exists', async () => {
      repository.exist.mockResolvedValue(true);

      await expect(
        service.updateTab('123', { sign: 'existing-sign' }),
      ).rejects.toThrow('The tab existing-sign already exists');
      expect(repository.exist).toHaveBeenCalledWith({
        where: { sign: 'existing-sign' },
      });
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('getTabs', () => {
    it('should return a list of tabs with selected fields', async () => {
      const tabs = [{ sign: 'tab1', summary: 'summary1' }];
      repository.find.mockResolvedValue(tabs as Tab[]);

      const result = await service.getTabs();
      expect(result).toEqual(tabs);
      expect(repository.find).toHaveBeenCalledWith({
        select: ['sign', 'summary'],
      });
    });
  });
});
