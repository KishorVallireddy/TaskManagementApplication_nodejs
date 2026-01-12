const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const ctrl = require("../controllers/task.controller");

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - priority
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finish Swagger
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 example: High
 *               status:
 *                 type: string
 *                 example: Pending
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/", auth, ctrl.createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get tasks (filter by status & priority)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: Pending
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           example: High
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/", auth, ctrl.getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put("/:id", auth, ctrl.updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/:id", auth, ctrl.deleteTask);

module.exports = router;
