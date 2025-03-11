/**
 * @swagger
 * /api/users/{userId}/role:
 *   patch:
 *     summary: Update user role
 *     description: Updates the role of a user. Only accessible by admins .
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose role is to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: "ADMIN"
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: |
 *       Creates a new user. Only accessible by admins .
 *       Role currently has 3 values:
 *       - User: 0
 *       - Admin: 1
 *       - Doctor: 2
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get list of users
 *     description: Retrieves a list of users with optional pagination and filters.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ascending, descending]
 *         description: Sorting order
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date]
 *         description: Sort users by date
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves user details based on user ID.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update user details
 *     description: Updates user details such as name. Only accessible by authorized users.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Updated"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by ID. Only accessible by admins .
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to be deleted
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/remove-membership/{id}:
 *   put:
 *     summary: Remove user membership
 *     description: Removes the current subscription or membership of a user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose membership is to be removed
 *     responses:
 *       200:
 *         description: Membership removed successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/consultation/{id}/rating:
 *   post:
 *     summary: Create a consultation rating
 *     description: Allows a user to submit a rating for a consultation.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The consultation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Consultation rating has been created
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update a consultation rating
 *     description: Allows a user to update their rating for a consultation.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The consultation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Consultation rating has been updated
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Remove a consultation rating
 *     description: Allows a user to remove their rating for a consultation.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The consultation ID
 *     responses:
 *       200:
 *         description: Consultation rating has been removed
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
