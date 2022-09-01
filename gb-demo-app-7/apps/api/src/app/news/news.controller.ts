import { Body, Controller, Get, Header, Post, Param } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import Redis from 'ioredis';


const redis = new Redis();

export class CreateNewsDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

@Controller('news')
export class NewsController {

  @Get()
  async getNews() {
    const exists = await redis.exists("newsCache.0");

    if (exists !== 1) {

      const news = Object.keys([...Array(5)])
        .map(key => Number(key) + 1)
        .map(n => ({
          id: n,
          title: `Важная новость ${n}`,
          description: (rand => ([...Array(rand(1000))].map(() => rand(10 ** 16).toString(36).substring(rand(10))).join(' ')))(max => Math.ceil(Math.random() * max)),
          createdAt: Date.now()
        }))

      for (let i = 0; i < news.length; i++) {
        await redis.hmset("newsCache." + i, news[i])
        await redis.expire("newsCache." + i, 15)
      }
      return news
    } else {

      const newsCache = [];
      for (let i = 0; i < 5; i++) {
        newsCache.push(await redis.hgetall("newsCache." + i))
      }
      return await newsCache;
    }

  }

  @Get('score')
  async getScore() {
await redis.del("authorScore")
    const authors = Object.keys([...Array(15)])
      .map(key => Number(key) + 1)
      .map(n => ({
        name: (rand => ([...Array(rand(5))].map(() => rand(10 ** 16).toString(36).substring(rand(10))).join(' ')))(max => Math.ceil(Math.random() * max)),
        score: Math.floor(Math.random() * 100) + 1
      }))

    console.log('authors', authors);
    await redis.zadd('authorScore', ...authors.map(({ name, score }) => [score, name]))
     console.log(await redis.zrevrange("authorScore", 0, 9, "WITHSCORES")); 
    return await redis.zrevrange("authorScore", 0, 9, "WITHSCORES")
   

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

  @Get('test-redis/:searchtext')
  async testRedis(@Param('searchtext') searchtext: string) {
    redis.set("foo", searchtext);

    return await redis.get("foo");
  }
}
