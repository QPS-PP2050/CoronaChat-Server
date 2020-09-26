import { Router } from 'express';

const router = Router();

/* Removed temporarily in favour of an IRC-esque approach
router.get('/channels/:channelId/messages', (req, res) => {
     // Placeholder to get messages
})

router.post('/channels/:channelId/messages', (req, res) => {
     // Placeholder to send messages
})
*/

router.post('/channels/', (req, res) => {
    // Placeholder to create new channel
})

router.delete('channels/:channelId', (req, res) => {
    // Placeholder to delete channel
})

export default router;