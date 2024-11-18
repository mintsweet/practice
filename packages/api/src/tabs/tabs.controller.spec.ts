import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Tab } from '@/entities';

import { TabsController } from './tabs.controller';
import { TabsService } from './tabs.service';

describe('TabsController', () => {
  let controller: TabsController;
  let service: TabsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TabsController],
      providers: [
        {
          provide: TabsService,
          useValue: {
            createTab: jest.fn(),
            deleteTab: jest.fn(),
            updateTab: jest.fn(),
            getTabs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TabsController>(TabsController);
    service = module.get<TabsService>(TabsService);
  });

  describe('create', () => {
    it('should return success if tab is created', async () => {
      jest.spyOn(service, 'createTab').mockResolvedValue(undefined);

      const result = await controller.create({
        sign: 'test',
        summary: 'test summary',
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw BadRequestException if createTab fails', async () => {
      jest
        .spyOn(service, 'createTab')
        .mockRejectedValue(new Error('Creation failed'));

      await expect(
        controller.create({ sign: 'test', summary: 'test summary' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should return success if tab is deleted', async () => {
      jest.spyOn(service, 'deleteTab').mockResolvedValue(undefined);

      const result = await controller.delete('1');
      expect(result).toEqual({ success: true });
    });

    it('should throw BadRequestException if deleteTab fails', async () => {
      jest
        .spyOn(service, 'deleteTab')
        .mockRejectedValue(new Error('Deletion failed'));

      await expect(controller.delete('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should return success if tab is updated', async () => {
      jest.spyOn(service, 'updateTab').mockResolvedValue(undefined);

      const result = await controller.update('1', {
        sign: 'updated sign',
        summary: 'updated summary',
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw BadRequestException if updateTab fails', async () => {
      jest
        .spyOn(service, 'updateTab')
        .mockRejectedValue(new Error('Update failed'));

      await expect(
        controller.update('1', {
          sign: 'updated sign',
          summary: 'updated summary',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('query', () => {
    it('should return tabs if getTabs is successful', async () => {
      const tabs = [
        {
          id: '1',
          sign: 'tab1',
          summary: 'summary1',
        },
      ];
      jest.spyOn(service, 'getTabs').mockResolvedValue(tabs as Tab[]);

      const result = await controller.query();
      expect(result).toEqual(tabs);
    });

    it('should throw BadRequestException if getTabs fails', async () => {
      jest
        .spyOn(service, 'getTabs')
        .mockRejectedValue(new Error('Query failed'));

      await expect(controller.query()).rejects.toThrow(BadRequestException);
    });
  });
});
