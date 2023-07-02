const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const {
    v4: uuidv4
} = require('uuid');
const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  text: true,
  json: true,
}));

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  }),
);

let tickets = [
  {
    id: uuidv4(),
    name: 'Поменять краску в принтере, ком. 404',
    description: 'Принтер HP LJ-1210, картриджи на складе',
    status: false,
    created: new Date().toLocaleString()
},
{
    id: uuidv4(),
    name: 'Переустановить Windows, PC-Hall24',
    description: '',
    status: false,
    created: new Date().toLocaleString()
},
{
    id: uuidv4(),
    name: 'Установить обновление KB-31642dv3875',
    description: 'Вышло критическое обновление для Windows',
    status: false,
    created: new Date().toLocaleString()
  },
];

app.use(async (ctx) => {
  const { method } = ctx.request.query;

  let ticket;
  let inputData;

  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets.map((item) => ({
        id: item.id, name: item.name, description: item.description,status: item.status, created: item.created,
      }));
      return;
    case 'ticketById':
       ctx.response.body = tickets.find((item) => item.id === ctx.request.query.id);
      return;
      
    case 'createTicket':
      inputData = JSON.parse(ctx.request.body);
      tickets.push({
        id: uuidv4(),
        name: inputData.name,
        description: inputData.description,
        status: false,
        created: new Date().toLocaleString(),
      });
      console.log('create tisket')
      ctx.response.body = tickets;
      return;
    case 'deleteTicket':
      tickets = tickets.filter((item) => item.id !== ctx.request.query.id);
      console.log(tickets, ctx.request.query.id )
      ctx.response.body = tickets;
      console.log('delete ticket')
      return;
    case 'editTicket':
      inputData = JSON.parse(ctx.request.body);
      ticket = tickets.find((item) => item.id === ctx.request.query.id);
      ticket.name = inputData.name;
      ticket.description = inputData.description;
      ctx.response.body = tickets;
      return;
    case 'editStatus':
      inputData = JSON.parse(ctx.request.body);
      // ticket = tickets.find((item) => item.id === Number(ctx.request.query.id));
      ticket = tickets.find((item) => item.id === ctx.request.query.id);
      ticket.status = (inputData.status === 'true');
      ctx.response.body = tickets;
      return;
    default:
      ctx.response.status = 404;
  }
});

const port = 7060;
const server = http.createServer(app.callback());
server.listen(port, (err) => {
  if (err) {
    console.log('Error occured:', err);
    return;
  }
  console.log(`Server is listening on ${port} port`);
});
