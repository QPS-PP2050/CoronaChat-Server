import { Router } from 'express';
import { getRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import * as Snowflake from './../../../utils/Snowflake';
import { Server } from './../../../orm/entities/Server';
import { Channel } from '../../../orm/entities/Channel';
// import { Member } from '../../../orm/entities/Member';
import { authorization } from '../middleware/authorization';
import { User } from '../../../orm/entities/User';

const router = Router();


// Removed temporarily in favour of automatically creating a single server per user
router.post('/servers', authorization, async (req, res) => {
     // Placeholder to Create Server
    const user = await getRepository(User).findOne(req.body.ownerID) as User;

    const server = new Server();
    server.id = Snowflake.generate();
    server.name = req.body.name;
    server.owner = req.body.ownerID;
    server.members = [user]

    const channel = new Channel();
    channel.id = Snowflake.generate();
    channel.name = 'general';
    channel.server = server;

    // const member = new Member();
    // member.user = req.body.ownerID;
    // member.server = server;

    await getRepository(Server).save(server);
    await getRepository(Channel).save(channel);
    // await getRepository(Member).save(member);
    res.status(201).json(server);
    console.log(server);
 })

 router.get('/servers/:serverId/channels', authorization, async (req, res) => {
    // Placeholder to get channels
    const server = await getRepository(Server)
    .findOne(req.params.serverId, {relations: ['channels']}) as Server;

    res.status(200).send(server.channels)
    console.log(server.channels)
})

router.post('/servers/:serverId/channels', authorization, async (req, res) => {
    // Placeholder to create new channel
    const channel = new Channel();
    channel.id = Snowflake.generate();
    channel.name = req.body.name;
    channel.server = await getRepository(Server).findOne(req.params.serverId) as Server;

    await getRepository(Channel).save(channel);
    res.status(201).send(channel)
    console.log(channel)
})

router.get('/servers/:serverId', authorization, async (req, res) => {
   const serverID = req.params.serverId;

    const server = await getRepository(Server).findOne(serverID, {relations: ['channels', 'owner', 'members']})
    
    res.status(200).send(classToPlain(server))
    console.log(classToPlain(server))
})

router.patch('/servers/:serverId', authorization, async (req, res) => {
    // Placeholder to RESET server
    

})

/* Removed temporarily
router.delete('/servers/:serverId', (req, res) => {
    // Placeholder to delete server
})
*/

export default router;