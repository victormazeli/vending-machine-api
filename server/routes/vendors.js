import { Router } from "express";
const router = Router();

/**
 * @description - This the vendors routes
 */
router.get('/', (req, res) => {
    res.send('testing vendor service route');

});

export default router;