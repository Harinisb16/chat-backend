import { Router } from 'express';
import * as teamController from '../controllers/team.controller';

const router = Router();
// router.get('/team/:teamId', teamController.getTeamDetailsWithUsers);

router.post('/assign-users', teamController.assignUsersToTeam);
router.post('/', teamController.createTeam);
router.get('/', teamController.getAllTeams);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

router.post('/teams/create-with-users', teamController.createTeamWithUsers);
export default router;
