import { Bot, type Context, session, type SessionFlavor } from "grammy";
import { PsqlAdapter } from '@grammyjs/storage-drizzle-neon';
import { Client } from "pg";

interface SessionData {
  counter: number;
}
type MyContext = Context & SessionFlavor<SessionData>;

async function bootstrap() {
  const client = new Client({
    user: 'postgres',
    hostname: '127.0.0.1',
    database: 'test',
    password: '123456',
    port: 5432
  });

  await client.connect();

  const bot = new Bot<MyContext>("");
  bot.use(
    session({
      initial: () => ({ counter: 0 }),
      storage: await PsqlAdapter.create({ tableName: 'sessions', client }),
    })
  );

  bot.command("stats", (ctx) =>
    ctx.reply(`Already got ${ctx.session.counter} photos!`)
  );
  bot.on(":photo", (ctx) => ctx.session.counter++);

  bot.start();
}

bootstrap()
