import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from './history.service';
import { Order } from '../orders/entities/order.entity';
import { OrderType } from '../common/enums/order-type.enum';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryService],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
    service.clearHistory(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveOrder', () => {
    it('should save an order to history', () => {
      const order = new Order('order-1', OrderType.BUY, 10000, new Date(), []);

      service.saveOrder(order);

      expect(service.getOrderCount()).toBe(1);
    });

    it('should save multiple orders', () => {
      const order1 = new Order('order-1', OrderType.BUY, 10000, new Date(), []);
      const order2 = new Order('order-2', OrderType.SELL, 5000, new Date(), []);

      service.saveOrder(order1);
      service.saveOrder(order2);

      expect(service.getOrderCount()).toBe(2);
    });
  });

  describe('getAllOrders', () => {
    it('should return empty array when no orders', () => {
      const orders = service.getAllOrders();
      expect(orders).toEqual([]);
    });

    it('should return all saved orders', () => {
      const order1 = new Order('order-1', OrderType.BUY, 10000, new Date(), []);
      const order2 = new Order('order-2', OrderType.SELL, 5000, new Date(), []);

      service.saveOrder(order1);
      service.saveOrder(order2);

      const orders = service.getAllOrders();
      expect(orders).toHaveLength(2);
      expect(orders[0].orderId).toBe('order-1');
      expect(orders[1].orderId).toBe('order-2');
    });

    it('should return a copy of orders array', () => {
      const order = new Order('order-1', OrderType.BUY, 10000, new Date(), []);
      service.saveOrder(order);

      const orders1 = service.getAllOrders();
      const orders2 = service.getAllOrders();

      expect(orders1).toEqual(orders2);
      expect(orders1).not.toBe(orders2); // Different array instances
    });
  });

  describe('getOrderCount', () => {
    it('should return 0 for empty history', () => {
      expect(service.getOrderCount()).toBe(0);
    });

    it('should return correct count', () => {
      const order1 = new Order('order-1', OrderType.BUY, 10000, new Date(), []);
      const order2 = new Order('order-2', OrderType.SELL, 5000, new Date(), []);

      service.saveOrder(order1);
      expect(service.getOrderCount()).toBe(1);

      service.saveOrder(order2);
      expect(service.getOrderCount()).toBe(2);
    });
  });

  describe('clearHistory', () => {
    it('should clear all orders', () => {
      const order1 = new Order('order-1', OrderType.BUY, 10000, new Date(), []);
      const order2 = new Order('order-2', OrderType.SELL, 5000, new Date(), []);

      service.saveOrder(order1);
      service.saveOrder(order2);
      expect(service.getOrderCount()).toBe(2);

      service.clearHistory();
      expect(service.getOrderCount()).toBe(0);
      expect(service.getAllOrders()).toEqual([]);
    });
  });
});
