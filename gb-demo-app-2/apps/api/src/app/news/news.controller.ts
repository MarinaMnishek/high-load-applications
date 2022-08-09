import { Body, Controller, CacheInterceptor, CacheTTL, CACHE_MANAGER, Inject, Get, Header, Post, UseInterceptors } from '@nestjs/common';

import { IsNotEmpty } from 'class-validator';

export class CreateNewsDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

@Controller('news')
export class NewsController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  @Get()
  // @Header('Cache-Control', 'public, max-age=3')
  async getNews() {
    const cachedItems = await this.cacheManager.get('cached-items')
    if (cachedItems) return cachedItems;

    return new Promise(resolve => {

      const news = Object.keys([...Array(20)])
        .map(key => Number(key) + 1)
        .map(n => ({
          id: n,
          title: `Важная новость ${n}`,
          description: (rand => ([...Array(rand(1000))].map(() => rand(10 ** 16).toString(36).substring(rand(10))).join(' ')))(max => Math.ceil(Math.random() * max)),
          createdAt: Date.now()
        }))

      this.cacheManager.set('cached-items', news, {
        ttl: 10,
      });

      setTimeout(() => {
        resolve(news);
      }, 100)
    });
  }


  @Post()
  @Header('Cache-Control', 'none')
  create(@Body() peaceOfNews: CreateNewsDto) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Новость успешно создана', peaceOfNews);
        resolve({ id: Math.ceil(Math.random() * 1000), ...peaceOfNews });
      }, 100)
    });
  }
}
