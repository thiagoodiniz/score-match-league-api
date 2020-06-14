/**
 * @swagger
 * /player/{id}:
 *  get:
 *    parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       type: integer
 *       minimun: 1
 *       default: 1
 *       description: The player id
 * 
 *    description: Use to request a specific player
 *    responses:
 *      '200':
 *        description: A successful response
 * 
 *  put:
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        minimun: 1
 *        default: 1
 *        description: The player id
 *      - in: body
 *        name: player
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - uf
 *          properties:
 *            name:
 *              type: string
 *              example: Thiago Diniz
 *            uf:
 *              type: string
 *              example: SP
 * 
 *    description: Use to update a specific player
 *    responses:
 *     '200':
 *       description: A successful response
 * 
 * /player:
 *  get: 
 *    description: Use to request all players
 *    responses:
 *      '200':
 *        description: A successful response
 * 
 *  post:
 *    description: Use to create a new player
 *    parameters:
 *      - in: body
 *        name: player
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - uf
 *          properties:
 *            name:
 *              type: string
 *              example: Thiago Diniz
 *            uf:
 *              type: string
 *              example: SP
 *    responses:
 *      '200':
 *        description: A successful response
 * 
 */