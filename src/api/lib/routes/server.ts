import { Router } from 'express';
// import { Server } from './../../../orm/entities/Server';
// import { connect } from './../../../orm/dbConfig';

const router = Router();

/* Removed temporarily in favour of automatically creating a single server per user
router.post('/servers', (req, res) => {
     // Placeholder to Create Server
 })
*/

router.post('/servers/:serverId/channels', (req, res) => {
    // Placeholder to create new channel
})

router.patch('/servers/:serverId', (req, res) => {
    // Placeholder to RESET server
})

/* Removed temporarily
router.delete('/servers/:serverId', (req, res) => {
    // Placeholder to delete server
})
*/

export default router;