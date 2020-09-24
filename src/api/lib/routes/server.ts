import { Router } from 'express';
import { Server } from './../../../orm/entities/Server';
import { connect } from './../../../orm/dbConfig';

const router = Router();

router.post('/servers', (req, res) => {
     // Placeholder to Create Server
 })

router.post('/servers/:serverId/channels', (req, res) => {
    // Placeholder to create new channel
})

router.delete('/servers/:serverId', (req, res) => {
    // Placeholder to delete server
})

export default router;