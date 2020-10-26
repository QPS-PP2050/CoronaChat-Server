import { Router } from 'express';
import { getRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { setupUser } from '../functions';
import { authorization } from '../middleware/authorization';
import * as Snowflake from '@utils/Snowflake';
import { Server, Channel, User } from '@orm/entities';

const router = Router();


// Removed temporarily in favour of automatically creating a single server per user
router.post('/servers', authorization, async (req, res) => {
	// Placeholder to Create Server
	const user = await getRepository(User).findOne(req.body.ownerID) as User;

	const server = await setupUser(req, user);

	res.status(201).json(classToPlain(server));
	console.log(server);
});

router.get('/servers/:serverId/channels', authorization, async (req, res) => {
	// Placeholder to get channels
	const server = await getRepository(Server)
		.findOne(req.params.serverId, { relations: ['channels'] }) as Server;

	res.status(200).send(server.channels);
	console.log(server.channels);
});

router.post('/servers/:serverId/channels', authorization, async (req, res) => {
	// Placeholder to create new channel
	const channel = new Channel();
	channel.id = Snowflake.generate();
	channel.name = req.body.name;
	channel.type = req.body.type;
	channel.server = await getRepository(Server).findOne(req.params.serverId) as Server;

	await getRepository(Channel).save(channel);
	res.status(201).send(channel);
	console.log(channel);
});

router.get('/servers/:serverId', authorization, async (req, res) => {
	const serverID = req.params.serverId;
	const server = await getRepository(Server)
		.findOne(serverID, { relations: ['channels', 'owner', 'members'] });

	res.status(200).send(classToPlain(server));
	console.log(classToPlain(server));
});

router.put('/servers/:serverId/members', authorization, async (req, res) => {
	const serverID = req.params.serverId;
	const { username } = req.body;

	console.log(serverID);
	const user = await getRepository(User)
		.findOne({
			where: {
				username
			}
		}) as User;

	const server = await getRepository(Server)
		.findOne(serverID, {
			relations: ['members']
		}) as Server;

	server.members.push(user);
	await getRepository(Server)
		.save(server);

	res.status(201).send({ ok: true, message: 'User added to server' });
	console.log(server);
});

/* router.patch('/servers/:serverId', authorization, async (req, res) => {
	// Placeholder to RESET server


});
*/

/* Removed temporarily
router.delete('/servers/:serverId', (req, res) => {
    // Placeholder to delete server
})
*/

export default router;
