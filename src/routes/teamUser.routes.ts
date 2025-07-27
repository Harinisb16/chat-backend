import express from 'express';
import * as teamUserController from '../controllers/teamUser.controller';

const router = express.Router();
router.post('/teamuser', teamUserController.createTeamUserController);
// router.get('/teamuser', teamUserController.getAllTeamUsersController);
// router.get('/:id', teamUserController.getTeamUserById);
// router.put('/:id', teamUserController.updateTeamUser);
// router.delete('/:id', teamUserController.deleteTeamUser);
// router.delete('/', teamUserController.deleteAllTeamUsers);

export default router;
