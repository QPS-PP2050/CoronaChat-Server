import { Router } from 'express';
import { getRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { Server } from './../../../orm/entities/Server';
import { Channel } from '../../../orm/entities/Channel';
// import { User } from '../../../orm/entities/User';

const router = Router();


// Removed temporarily in favour of automatically creating a single server per user
router.post('/servers', async (req, res) => {
     // Placeholder to Create Server
    /* const server = new Server();
    server.name = req.body.name;
    server.owner = await getRepository(User).findOne(req.body.ownerID) as User;
    server.owner.servers.push(server);

    await getRepository(User).save(server.owner);
    await getRepository(Server).save(server); 
    res.send(server);
    console.log(server) */

    const server = await getRepository(Server)
        .createQueryBuilder()
        .insert()
        .into(Server)
        .values([
            {name: req.body.name, owner: req.body.ownerID}
        ])
        .execute()
    console.log(server);
    res.send(server);
 })

 router.get('/servers/:serverId/channels', async (req, res) => {
    // Placeholder to create new channel
    const server = await getRepository(Server)
    .findOne(req.params.serverId) as Server;

    res.send(server)
    console.log(server)
})

router.post('/servers/:serverId/channels', async (req, res) => {
    // Placeholder to create new channel
    const channel = new Channel();
    channel.name = req.body.name;
    channel.server = await getRepository(Server).findOne(req.params.serverId) as Server;

    await getRepository(Channel).save(channel);
    res.send(channel)
    console.log(channel)
})

router.get('/servers/:serverId', async (req, res) => {
   const serverID = req.params.serverId;

    const server = await getRepository(Server).findOne(serverID, {relations: ['channels', 'owner', 'users']})
    /*const server = await getRepository(Server)
        .createQueryBuilder()
        .select('server')
        .from(Server, 'server')
        .leftJoinAndSelect('server.owner', 'user')
        .getOne()*/
    
    res.send(classToPlain(server))
    console.log(classToPlain(server))
})

router.patch('/servers/:serverId', async (req, res) => {
    // Placeholder to RESET server
    

})

/* Removed temporarily
router.delete('/servers/:serverId', (req, res) => {
    // Placeholder to delete server
})
*/

export default router;