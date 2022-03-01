import { Router } from "express";
const router = Router();

/**
 * @description - This the users routes
 */
router.get('/', (req, res) => {
    res.send('testing user service route');

});

export default router;