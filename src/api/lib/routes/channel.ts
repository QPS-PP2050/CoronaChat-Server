import { Router } from 'express';
import { getRepository } from 'typeorm';
import { authorization } from '../middleware/authorization';
import { Channel } from '@orm/entities/Channel';


const router = Router();

/* Removed temporarily in favour of an IRC-esque approach
router.get('/channels/:channelId/messages', (req, res) => {
     // Placeholder to get messages
})

router.post('/channels/:channelId/messages', (req, res) => {
     // Placeholder to send messages
})
*/

router.get('/channels/:channelId', authorization, async (req, res) => {
	const channel = await getRepository(Channel)
		.findOne(req.params.channelId) as Channel;

	res.status(200).send(channel);
});

/* router.delete('channels/:channelId', authorization, async (req, res) => {
	// Placeholder to delete channel
});
*/

export default router;
