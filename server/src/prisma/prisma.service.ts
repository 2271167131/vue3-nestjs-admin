import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // 允许开发阶段：数据库未启动时后端也能先启动
    // 具体数据库错误会在首次查询时抛出。
    try {
      await this.$connect();
    } catch (err) {
      console.error('[Prisma] 连接数据库失败（后端仍将启动）：', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}