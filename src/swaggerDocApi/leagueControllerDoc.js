/**
 * @swagger
 * /league:
 *  get:
 *    description: Use to request the active league or the last league finished. And its players with league statistics.
 * 
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: No league in database
 * 
 *  post: 
 *    description: Use to create a new league and it division.
 *    parameters:
 *     - in: body
 *       name: league
 *       description: The league name.
 *       schema:
 *         type: object
 *         required:
 *           - name
 *         properties:
 *           name:
 *             type: string
 *             example: 20ª Liga Brasileira de Score Match
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Have a league active
 * 
 * /league/divisionPlayers:
 *  post: 
 *    description: Use to insert players in league division
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          required:
 *            - leagueId
 *            - division
 *            - players
 *          properties:
 *            leagueId:
 *              type: integer
 *              example: 1
 *            division:
 *              type: string
 *              example: A
 *            players:
 *              type: array
 *              items:
 *                type: integer
 *              example: [1,2,3]
 *    responses:
 *      '200': 
 *         description: A successful response.
 *      '400': 
 *         description: <p>When one or more of the parameters does not passed.<br>
 *                      When the player limit is exceeded.<br>
 *                      When one of the passed players is already added in division.</p>
 * 
 * /league/divisionMatches:
 *  post:
 *    description: Use to create division matches
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          required:
 *            - leagueId
 *            - leagueDivision
 *            - rounds
 *          properties:
 *            leagueId:
 *              type: integer
 *              example: 1
 *            leagueDivision:
 *              type: string
 *              example: A
 *            rounds:
 *              type: array
 *              items:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    round:
 *                      type: integer
 *                      example: 1
 *                    idLeagueDivisionPlayer1: 
 *                      type: integer
 *                      example: 1
 *                    idLeagueDivisionPlayer2: 
 *                      type: integer
 *                      example: 1
 *    responses:
 *      '200':
 *         description: A successful response.
 *      '400': 
 *         description: <p>When one or more of the parameters does not passed.<br>
 *                         When the league was not found with the id passed.<br>
 *                         When an invalid number of rounds is passed.<br>
 *                         When an invalid amount of games per round is passed.</p>
 * 
 *     
 *  get:
 *    description: Use to get all division matches with result.
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          required:
 *            - leagueDivisionId
 *          properties:
 *            leagueDivisionId:
 *              type: integer
 *              example: 1
 *    responses:
 *      '200':
 *         description: A successful response.
 *      '400': 
 *         description: When one or more of the parameters does not passed.
 * 
 *  put:
 *    description: Use to update scoreboard of the division matches
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          required:
 *            - matches
 *          properties:
 *            matches:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  idLeagueDivisionMatch:
 *                    type: integer
 *                    example: 1
 *                  player1:
 *                    type: object
 *                    properties:
 *                      scoredGoals:
 *                        type: integer
 *                        example: 1 
 *                  player2:
 *                    type: object
 *                    properties:
 *                      scoredGoals:
 *                        type: integer
 *                        example: 2
 *    responses:
 *      '200':
 *         description: A successful response.
 *      '400': 
 *         description: When one or more of the parameters does not passed.
 * 
 * /league/divisionMatches/{id}:
 *  get:
 *    description: Use to request a specific match;
 *    parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       type: integer
 *       default: 1
 *       description: The division match id
 *     - in: body
 *       schema:
 *          type: object
 *          required:
 *            - leagueDivisionId
 *          properties:
 *            leagueDivisionId:
 *              type: integer
 *              example: 1
 * 
 *    responses:
 *      '200':
 *        description: A successful response
 */